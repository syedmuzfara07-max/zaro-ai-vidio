package com.zaro.aivideo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.zaro.aivideo.R
import com.zaro.aivideo.ui.components.AdMobBanner
import com.zaro.aivideo.ui.navigation.Screen
import com.zaro.aivideo.ui.theme.*
import com.zaro.aivideo.viewmodel.MainViewModel

@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    val videos by viewModel.videos.collectAsState()
    val credits by viewModel.credits.collectAsState()
    val isPremium by viewModel.isPremium.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Hero Header Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF312E81), Color(0xFF1E1B4B), BackgroundDark)
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Zaro AI Studio",
                                color = IndigoPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp
                            )
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isPremium) AmberGold.copy(alpha = 0.2f) else CardBorder
                            ) {
                                Text(
                                    text = if (isPremium) "VIP UNLIMITED" else "$credits Credits",
                                    color = if (isPremium) AmberGold else TextPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Text(
                            text = stringResource(R.string.home_hero_title),
                            color = TextPrimary,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black,
                            lineHeight = 26.sp
                        )

                        Text(
                            text = stringResource(R.string.home_hero_subtitle),
                            color = TextSecondary,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // Action Buttons Row
        item {
            Text(
                text = "Creation Studio",
                color = TextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Text to Video
                Button(
                    onClick = { navController.navigate(Screen.TextToVideo.route) },
                    modifier = Modifier.weight(1f).height(90.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.MovieCreation, contentDescription = null, tint = IndigoPrimary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(stringResource(R.string.nav_text_video), fontSize = 11.sp, color = TextPrimary)
                    }
                }

                // Image to Video
                Button(
                    onClick = { navController.navigate(Screen.ImageToVideo.route) },
                    modifier = Modifier.weight(1f).height(90.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.Image, contentDescription = null, tint = PinkAccent)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(stringResource(R.string.nav_image_video), fontSize = 11.sp, color = TextPrimary)
                    }
                }

                // Voice AI
                Button(
                    onClick = { navController.navigate(Screen.TextToSpeech.route) },
                    modifier = Modifier.weight(1f).height(90.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.Mic, contentDescription = null, tint = EmeraldGreen)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(stringResource(R.string.nav_voice), fontSize = 11.sp, color = TextPrimary)
                    }
                }
            }
        }

        // Recent Creations
        if (videos.isNotEmpty()) {
            item {
                Text(
                    text = "Recent Creations",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(videos) { video ->
                        Card(
                            modifier = Modifier
                                .width(140.dp)
                                .height(200.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .clickable {
                                    navController.navigate(Screen.VideoPlayer.createRoute(video.id))
                                },
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
                        ) {
                            Box(modifier = Modifier.fillMaxSize()) {
                                AsyncImage(
                                    model = video.thumbnailUrl,
                                    contentDescription = video.title,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(
                                            Brush.verticalGradient(
                                                listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                                            )
                                        )
                                )
                                Column(
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .padding(8.dp)
                                ) {
                                    Text(
                                        text = video.title,
                                        color = TextPrimary,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = "${video.durationSeconds}s • ${video.aspectRatio}",
                                        color = TextSecondary,
                                        fontSize = 9.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // AdMob Banner View on Free Tier
        if (!isPremium) {
            item {
                AdMobBanner()
            }
        }
    }
}
