package com.zaro.aivideo.ui.navigation

sealed class Screen(val route: String, val title: String) {
    object Home : Screen("home", "Home")
    object TextToVideo : Screen("text_to_video", "Text to Video")
    object ImageToVideo : Screen("image_to_video", "Image to Video")
    object TextToSpeech : Screen("text_to_speech", "Voice AI")
    object History : Screen("history", "History")
    object Profile : Screen("profile", "Profile")
    object VideoPlayer : Screen("player/{videoId}", "Video Player") {
        fun createRoute(videoId: String) = "player/$videoId"
    }
}
