package com.zaro.aivideo

import android.app.Application
import com.google.android.gms.ads.MobileAds

class ZaroApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Google Mobile Ads (AdMob) SDK on Application launch
        MobileAds.initialize(this) {}
    }
}
