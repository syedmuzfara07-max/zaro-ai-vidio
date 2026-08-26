package com.zaro.aivideo.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import com.zaro.aivideo.ui.components.AdMobBanner
import com.zaro.aivideo.ui.screens.*
import com.zaro.aivideo.viewmodel.MainViewModel

@Composable
fun AppNavigation(
    navController: NavHostController,
    viewModel: MainViewModel = viewModel()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val isPremium by viewModel.isPremium.collectAsState()

    val bottomNavItems = listOf(
        Screen.Home to Icons.Default.Home,
        Screen.TextToVideo to Icons.Default.MovieCreation,
        Screen.ImageToVideo to Icons.Default.Image,
        Screen.TextToSpeech to Icons.Default.Mic,
        Screen.History to Icons.Default.History,
        Screen.Profile to Icons.Default.Person
    )

    Scaffold(
        bottomBar = {
            if (currentRoute != null && !currentRoute.startsWith("player")) {
                NavigationBar {
                    bottomNavItems.forEach { (screen, icon) ->
                        NavigationBarItem(
                            icon = { Icon(icon, contentDescription = screen.title) },
                            label = { Text(screen.title, style = MaterialTheme.typography.labelSmall) },
                            selected = currentRoute == screen.route,
                            onClick = {
                                if (currentRoute != screen.route) {
                                    navController.navigate(screen.route) {
                                        popUpTo(Screen.Home.route) { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.TextToVideo.route) {
                TextToVideoScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.ImageToVideo.route) {
                ImageToVideoScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.TextToSpeech.route) {
                TextToSpeechScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.History.route) {
                HistoryScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    navController = navController,
                    viewModel = viewModel
                )
            }
            composable(Screen.VideoPlayer.route) { backStackEntry ->
                val videoId = backStackEntry.arguments?.getString("videoId") ?: ""
                VideoPlayerScreen(
                    videoId = videoId,
                    navController = navController,
                    viewModel = viewModel
                )
            }
        }
    }
}
