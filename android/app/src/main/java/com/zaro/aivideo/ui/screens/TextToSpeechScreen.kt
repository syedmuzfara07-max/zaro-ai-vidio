package com.zaro.aivideo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.zaro.aivideo.R
import com.zaro.aivideo.ui.theme.*
import com.zaro.aivideo.viewmodel.MainViewModel

@Composable
fun TextToSpeechScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    var scriptText by remember { mutableStateOf("Welcome to Zaro AI Video Studio! Create stunning cinematic shorts in seconds.") }
    var selectedLanguage by remember { mutableStateOf("en") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = stringResource(R.string.nav_voice),
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        // Script input
        OutlinedTextField(
            value = scriptText,
            onValueChange = { scriptText = it },
            modifier = Modifier
                .fillMaxWidth()
                .height(130.dp),
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceDark,
                unfocusedContainerColor = SurfaceDark,
                focusedBorderColor = EmeraldGreen,
                unfocusedBorderColor = CardBorder,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )

        // Language Choice (Urdu, Hindi, English)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("en" to "English", "ur" to "Urdu (اردو)", "hi" to "Hindi (हिन्दी)").forEach { (lang, label) ->
                val isSelected = selectedLanguage == lang
                Button(
                    onClick = {
                        selectedLanguage = lang
                        if (lang == "ur") scriptText = "زارو اے آئی ویڈیو اسٹوڈیو میں خوش آمدید!"
                        else if (lang == "hi") scriptText = "ज़ारो एआई वीडियो स्टूडियो में आपका स्वागत है!"
                    },
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

        // Synthesize Button
        Button(
            onClick = { /* Call TTS */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
        ) {
            Icon(Icons.Default.PlayArrow, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Preview AI Voiceover", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}
