package com.zaro.aivideo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
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
fun ProfileScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    val isPremium by viewModel.isPremium.collectAsState()
    val credits by viewModel.credits.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = stringResource(R.string.nav_profile),
            color = TextPrimary,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        // User Info Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Creator Account", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("syedmuzfara07@gmail.com", color = TextSecondary, fontSize = 12.sp)
                HorizontalDivider(color = CardBorder)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Credits: $credits", color = IndigoPrimary, fontWeight = FontWeight.Bold)
                    Text(if (isPremium) "VIP PRO" else "Free Plan", color = if (isPremium) AmberGold else TextSecondary)
                }
            }
        }

        // Upgrade / Rewards Actions
        Button(
            onClick = { viewModel.setPremium(true) },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AmberGold)
        ) {
            Icon(Icons.Default.Star, contentDescription = null, tint = BackgroundDark)
            Spacer(modifier = Modifier.width(8.dp))
            Text(stringResource(R.string.premium_upgrade), color = BackgroundDark, fontWeight = FontWeight.Bold)
        }

        Button(
            onClick = { viewModel.addCredits(2) },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark)
        ) {
            Text(stringResource(R.string.watch_ad_reward), color = IndigoPrimary, fontWeight = FontWeight.Bold)
        }
    }
}
