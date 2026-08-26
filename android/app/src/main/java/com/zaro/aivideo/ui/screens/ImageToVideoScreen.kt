package com.zaro.aivideo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Upload
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.zaro.aivideo.R
import com.zaro.aivideo.ui.theme.*
import com.zaro.aivideo.viewmodel.MainViewModel

@Composable
fun ImageToVideoScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    var motionPrompt by remember { mutableStateOf("Smooth cinematic parallax motion, high detail") }
    var selectedMotion by remember { mutableStateOf("zoom_in") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = stringResource(R.string.nav_image_video),
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        // Photo Upload Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(SurfaceDark)
                .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                .clickable { /* Trigger Photo Picker */ },
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(Icons.Default.Upload, contentDescription = null, tint = PinkAccent, modifier = Modifier.size(36.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("Tap to select photo from gallery", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Text("Supports PNG, JPG, WEBP", color = TextSecondary, fontSize = 10.sp)
            }
        }

        // Motion Description
        OutlinedTextField(
            value = motionPrompt,
            onValueChange = { motionPrompt = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Animation Motion", color = TextSecondary) },
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceDark,
                unfocusedContainerColor = SurfaceDark,
                focusedBorderColor = PinkAccent,
                unfocusedBorderColor = CardBorder,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )

        // Generate Button
        Button(
            onClick = {
                viewModel.generateVideo(
                    prompt = motionPrompt,
                    style = "realistic_4k",
                    aspectRatio = "9:16",
                    cameraMotion = selectedMotion,
                    sourceImage = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PinkAccent)
        ) {
            Text("Animate Photo to Video", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}
