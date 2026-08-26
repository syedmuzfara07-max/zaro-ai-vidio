package com.zaro.aivideo.ui.components

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class AdMobRewardedManager(private val context: Context) {
    private var rewardedAd: RewardedAd? = null
    private var isLoading = false
    private val adUnitId = "ca-app-pub-3940256099942544/5224354917" // Google AdMob Standard Test Rewarded Unit ID

    fun loadAd(onLoaded: (() -> Unit)? = null) {
        if (isLoading || rewardedAd != null) return
        isLoading = true

        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(context, adUnitId, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdLoaded(ad: RewardedAd) {
                rewardedAd = ad
                isLoading = false
                Log.d("AdMob", "Rewarded ad loaded successfully.")
                onLoaded?.invoke()
            }

            override fun onAdFailedToLoad(adError: LoadAdError) {
                rewardedAd = null
                isLoading = false
                Log.e("AdMob", "Rewarded ad failed to load: ${adError.message}")
            }
        })
    }

    fun showAd(activity: Activity, onUserEarnedReward: (rewardAmount: Int) -> Unit) {
        rewardedAd?.let { ad ->
            ad.show(activity) { rewardItem ->
                val amount = rewardItem.amount.takeIf { it > 0 } ?: 2
                onUserEarnedReward(amount)
                rewardedAd = null
                loadAd() // Pre-load next ad
            }
        } ?: run {
            // If ad not loaded yet, grant demo fallback reward
            onUserEarnedReward(2)
            loadAd()
        }
    }
}
