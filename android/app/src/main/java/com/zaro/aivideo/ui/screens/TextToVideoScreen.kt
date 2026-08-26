package com.zaro.aivideo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.zaro.aivideo.R
import com.zaro.aivideo.ui.navigation.Screen
import com.zaro.aivideo.ui.theme.*
import com.zaro.aivideo.viewmodel.GenerationState
import com.zaro.aivideo.viewmodel.MainViewModel

@Composable
fun TextToVideoScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    var prompt by remember { mutableStateOf("") }
    var selectedRatio by remember { mutableStateOf("9:16") }
    var selectedStyle by remember { mutableStateOf("cinematic") }
    var selectedMotion by remember { mutableStateOf("pan_right") }
    var selectedLanguage by remember { mutableStateOf("en") }

    val generationState by viewModel.generationState.collectAsState()

    LaunchedEffect(generationState) {
        if (generationState is GenerationState.Success) {
            val video = (generationState as GenerationState.Success).video
            viewModel.resetGenerationState()
            navController.navigate(Screen.VideoPlayer.createRoute(video.id))
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(18.dp)
    ) {
        Text(
            text = stringResource(R.string.nav_text_video),
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        // Prompt Input
        OutlinedTextField(
            value = prompt,
            onValueChange = { prompt = it },
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp),
            placeholder = {
                Text(
                    stringResource(R.string.prompt_hint),
                    color = TextMuted,
                    fontSize = 13.sp
                )
            },
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceDark,
                unfocusedContainerColor = SurfaceDark,
                focusedBorderColor = IndigoPrimary,
                unfocusedBorderColor = CardBorder,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )

        // Aspect Ratio Selector (9:16, 16:9, 1:1)
        Text(
            text = stringResource(R.string.aspect_ratio),
            color = TextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("9:16" to "TikTok/Shorts", "16:9" to "Cinema", "1:1" to "Square").forEach { (ratio, label) ->
                val isSelected = selectedRatio == ratio
                Button(
                    onClick = { selectedRatio = ratio },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isSelected) IndigoPrimary else SurfaceDark
                    )
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(ratio, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text(label, fontSize = 9.sp, color = if (isSelected) TextPrimary else TextSecondary)
                    }
                }
            }
        }

        // Style Selector
        Text(
            text = stringResource(R.string.video_style),
            color = TextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("cinematic" to "Cinematic", "anime" to "Anime", "realistic_4k" to "4K Real").forEach { (st, label) ->
                val isSelected = selectedStyle == st
                Button(
                    onClick = { selectedStyle = st },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isSelected) IndigoDark else SurfaceDark
                    )
                ) {
                    Text(label, fontSize = 11.sp)
                }
            }
        }

        // Multilingual Voice Selector
        Text(
            text = stringResource(R.string.voice_language),
            color = TextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("en" to "English", "ur" to "Urdu (اردو)", "hi" to "Hindi (हिन्दी)").forEach { (lang, label) ->
                val isSelected = selectedLanguage == lang
                Button(
                    onClick = { selectedLanguage = lang },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isSelected) EmeraldGreen else SurfaceDark
                    )
                ) {
                    Text(label, fontSize = 10.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Generate Action Button
        val isLoading = generationState is GenerationState.Loading
        Button(
            onClick = {
                if (prompt.isNotBlank() && !isLoading) {
                    viewModel.generateVideo(
                        prompt = prompt,
                        style = selectedStyle,
                        aspectRatio = selectedRatio,
                        cameraMotion = selectedMotion,
                        language = selectedLanguage
                    )
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            enabled = !isLoading && prompt.isNotBlank(),
            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = TextPrimary,
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text((generationState as GenerationState.Loading).message, fontSize = 12.sp)
            } else {
                Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = AmberGold)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    stringResource(R.string.btn_generate),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
