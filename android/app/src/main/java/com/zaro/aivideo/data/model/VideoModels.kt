package com.zaro.aivideo.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "videos")
data class VideoItem(
    @PrimaryKey
    val id: String,
    val title: String,
    val prompt: String,
    val type: String, // "text_to_video" or "image_to_video"
    val style: String,
    val aspectRatio: String,
    val durationSeconds: Int,
    val thumbnailUrl: String,
    val videoUrl: String,
    val audioUrl: String? = null,
    val language: String = "en",
    val isFavorite: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

data class VideoGenerationRequest(
    @SerializedName("prompt") val prompt: String,
    @SerializedName("style") val style: String,
    @SerializedName("aspectRatio") val aspectRatio: String,
    @SerializedName("cameraMotion") val cameraMotion: String,
    @SerializedName("durationSeconds") val durationSeconds: Int = 5,
    @SerializedName("language") val language: String = "en",
    @SerializedName("sourceImage") val sourceImage: String? = null
)

data class VideoGenerationResponse(
    @SerializedName("id") val id: String,
    @SerializedName("videoUrl") val videoUrl: String,
    @SerializedName("thumbnailUrl") val thumbnailUrl: String,
    @SerializedName("title") val title: String,
    @SerializedName("status") val status: String
)

data class EnhancePromptRequest(
    @SerializedName("prompt") val prompt: String,
    @SerializedName("style") val style: String,
    @SerializedName("language") val language: String
)

data class EnhancePromptResponse(
    @SerializedName("enhancedPrompt") val enhancedPrompt: String,
    @SerializedName("suggestedMotion") val suggestedMotion: String?
)

data class TextToSpeechRequest(
    @SerializedName("text") val text: String,
    @SerializedName("voice") val voice: String,
    @SerializedName("language") val language: String,
    @SerializedName("speed") val speed: Float = 1.0f,
    @SerializedName("pitch") val pitch: Float = 1.0f
)

data class TextToSpeechResponse(
    @SerializedName("audioUrl") val audioUrl: String?,
    @SerializedName("durationSeconds") val durationSeconds: Double
)
