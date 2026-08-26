package com.zaro.aivideo.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.zaro.aivideo.data.local.AppDatabase
import com.zaro.aivideo.data.model.EnhancePromptRequest
import com.zaro.aivideo.data.model.VideoGenerationRequest
import com.zaro.aivideo.data.model.VideoItem
import com.zaro.aivideo.data.network.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

sealed class GenerationState {
    object Idle : GenerationState()
    data class Loading(val progress: Int, val message: String) : GenerationState()
    data class Success(val video: VideoItem) : GenerationState()
    data class Error(val errorMessage: String) : GenerationState()
}

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getDatabase(application)
    private val videoDao = db.videoDao()

    val videos = videoDao.getAllVideos().stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    private val _generationState = MutableStateFlow<GenerationState>(GenerationState.Idle)
    val generationState = _generationState.asStateFlow()

    private val _credits = MutableStateFlow(5)
    val credits = _credits.asStateFlow()

    private val _isPremium = MutableStateFlow(false)
    val isPremium = _isPremium.asStateFlow()

    fun addCredits(amount: Int) {
        _credits.value += amount
    }

    fun setPremium(premium: Boolean) {
        _isPremium.value = premium
    }

    fun toggleFavorite(video: VideoItem) {
        viewModelScope.launch {
            videoDao.updateVideo(video.copy(isFavorite = !video.isFavorite))
        }
    }

    fun deleteVideo(id: String) {
        viewModelScope.launch {
            videoDao.deleteVideoById(id)
        }
    }

    fun generateVideo(
        prompt: String,
        style: String,
        aspectRatio: String,
        cameraMotion: String,
        duration: Int = 5,
        language: String = "en",
        sourceImage: String? = null
    ) {
        if (!_isPremium.value && _credits.value <= 0) {
            _generationState.value = GenerationState.Error("No credits left. Please watch an ad or upgrade to Pro.")
            return
        }

        if (!_isPremium.value) {
            _credits.value -= 1
        }

        viewModelScope.launch {
            try {
                _generationState.value = GenerationState.Loading(20, "Analyzing prompt & generating storyboard...")

                val response = ApiClient.apiService.generateVideo(
                    VideoGenerationRequest(
                        prompt = prompt,
                        style = style,
                        aspectRatio = aspectRatio,
                        cameraMotion = cameraMotion,
                        durationSeconds = duration,
                        language = language,
                        sourceImage = sourceImage
                    )
                )

                _generationState.value = GenerationState.Loading(75, "Rendering neural video & audio...")

                val videoItem = if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    VideoItem(
                        id = body.id,
                        title = body.title,
                        prompt = prompt,
                        type = if (sourceImage != null) "image_to_video" else "text_to_video",
                        style = style,
                        aspectRatio = aspectRatio,
                        durationSeconds = duration,
                        thumbnailUrl = body.thumbnailUrl,
                        videoUrl = body.videoUrl,
                        language = language
                    )
                } else {
                    // Fallback local video entity for instant demo play
                    VideoItem(
                        id = UUID.randomUUID().toString(),
                        title = prompt.take(30),
                        prompt = prompt,
                        type = if (sourceImage != null) "image_to_video" else "text_to_video",
                        style = style,
                        aspectRatio = aspectRatio,
                        durationSeconds = duration,
                        thumbnailUrl = sourceImage ?: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
                        videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-at-night-41584-large.mp4",
                        language = language
                    )
                }

                videoDao.insertVideo(videoItem)
                _generationState.value = GenerationState.Success(videoItem)
            } catch (e: Exception) {
                _generationState.value = GenerationState.Error(e.localizedMessage ?: "Generation failed")
            }
        }
    }

    fun resetGenerationState() {
        _generationState.value = GenerationState.Idle
    }
}
