package com.zaro.aivideo.data.network

import com.zaro.aivideo.data.model.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

interface ApiService {
    @POST("/api/generate-video")
    suspend fun generateVideo(@Body request: VideoGenerationRequest): Response<VideoGenerationResponse>

    @POST("/api/enhance-prompt")
    suspend fun enhancePrompt(@Body request: EnhancePromptRequest): Response<EnhancePromptResponse>

    @POST("/api/synthesize-speech")
    suspend fun synthesizeSpeech(@Body request: TextToSpeechRequest): Response<TextToSpeechResponse>
}

object ApiClient {
    // Connects to the secure backend proxy server
    private const val BASE_URL = "https://ais-dev-uwn5prtossl343rwfooz4d-217592177887.asia-southeast1.run.app/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
