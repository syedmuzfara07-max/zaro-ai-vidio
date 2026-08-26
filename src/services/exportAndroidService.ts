import JSZip from 'jszip';

export interface AndroidFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export class ExportAndroidService {
  static getAndroidProjectFiles(): AndroidFile[] {
    return [
      {
        name: 'MainActivity.kt',
        path: 'app/src/main/java/com/zaro/aivideo/MainActivity.kt',
        language: 'kotlin',
        content: `package com.zaro.aivideo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.zaro.aivideo.ui.navigation.AppNavigation
import com.zaro.aivideo.ui.theme.ZaroAIVideoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ZaroAIVideoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavigation(navController = navController)
                }
            }
        }
    }
}`
      },
      {
        name: 'HomeScreen.kt',
        path: 'app/src/main/java/com/zaro/aivideo/ui/screens/HomeScreen.kt',
        language: 'kotlin',
        content: `package com.zaro.aivideo.ui.screens

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
                        Text(
                            text = stringResource(R.string.home_hero_title),
                            color = TextPrimary,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Black
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
    }
}`
      },
      {
        name: 'MainViewModel.kt',
        path: 'app/src/main/java/com/zaro/aivideo/viewmodel/MainViewModel.kt',
        language: 'kotlin',
        content: `package com.zaro.aivideo.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.zaro.aivideo.data.local.AppDatabase
import com.zaro.aivideo.data.model.VideoGenerationRequest
import com.zaro.aivideo.data.model.VideoItem
import com.zaro.aivideo.data.network.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed class GenerationState {
    object Idle : GenerationState()
    data class Loading(val progress: Int, val message: String) : GenerationState()
    data class Success(val video: VideoItem) : GenerationState()
    data class Error(val errorMessage: String) : GenerationState()
}

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getDatabase(application)
    private val videoDao = db.videoDao()

    val videos = videoDao.getAllVideos().stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    private val _generationState = MutableStateFlow<GenerationState>(GenerationState.Idle)
    val generationState = _generationState.asStateFlow()
}`
      },
      {
        name: 'AndroidManifest.xml',
        path: 'app/src/main/AndroidManifest.xml',
        language: 'xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

    <application
        android:name=".ZaroApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZaroAIVideo">

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.ZaroAIVideo">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
      },
      {
        name: 'build.gradle.kts (App)',
        path: 'app/build.gradle.kts',
        language: 'kotlin',
        content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.zaro.aivideo"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.zaro.aivideo"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.play.services.ads)
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.retrofit)
    implementation(libs.coil.compose)
    implementation(libs.androidx.room.runtime)
}`
      },
      {
        name: 'libs.versions.toml',
        path: 'gradle/libs.versions.toml',
        language: 'toml',
        content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
playServicesAds = "23.6.0"
composeBom = "2024.11.00"

[libraries]
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version = "1.9.3" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
play-services-ads = { group = "com.google.android.gms", name = "play-services-ads", version.ref = "playServicesAds" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`
      },
      {
        name: 'strings.xml (Urdu / اردو)',
        path: 'app/src/main/res/values-ur/strings.xml',
        language: 'xml',
        content: `<resources>
    <string name="app_name">زارو اے آئی ویڈیو</string>
    <string name="nav_home">ہوم</string>
    <string name="nav_text_video">ٹیکسٹ سے ویڈیو</string>
    <string name="nav_image_video">تصویر سے ویڈیو</string>
    <string name="nav_voice">اے آئی آواز</string>
    <string name="nav_history">تاریخچہ</string>
    <string name="nav_profile">پروفائل</string>
    <string name="btn_generate">اے آئی ویڈیو بنائیں</string>
    <string name="pro_badge">پرو</string>
</resources>`
      },
      {
        name: 'strings.xml (Hindi / हिन्दी)',
        path: 'app/src/main/res/values-hi/strings.xml',
        language: 'xml',
        content: `<resources>
    <string name="app_name">ज़ारो एआई वीडियो</string>
    <string name="nav_home">होम</string>
    <string name="nav_text_video">टेक्स्ट से वीडियो</string>
    <string name="nav_image_video">फ़ोटो से वीडियो</string>
    <string name="nav_voice">एआई आवाज़</string>
    <string name="nav_history">इतिहास</string>
    <string name="nav_profile">प्रोफ़ाइल</string>
    <string name="btn_generate">एआई वीडियो बनाएं</string>
    <string name="pro_badge">प्रो</string>
</resources>`
      }
    ];
  }

  /**
   * Generates a complete Android Studio project zip archive and triggers browser download
   */
  static async exportProjectZip(): Promise<void> {
    const zip = new JSZip();

    // Root configuration files
    zip.file('settings.gradle.kts', `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "ZaroAIVideo"
include(":app")`);

    zip.file('build.gradle.kts', `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`);

    zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`);

    // Gradle Wrapper & Version Catalog
    zip.file('gradle/wrapper/gradle-wrapper.properties', `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`);

    zip.file('gradle/libs.versions.toml', `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
navigationCompose = "2.8.4"
playServicesAds = "23.6.0"
retrofit = "2.11.0"
okhttp = "4.12.0"
coil = "2.7.0"
media3 = "1.5.1"
room = "2.6.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
play-services-ads = { group = "com.google.android.gms", name = "play-services-ads", version.ref = "playServicesAds" }
androidx-media3-exoplayer = { group = "androidx.media3", name = "media3-exoplayer", version.ref = "media3" }
androidx-media3-ui = { group = "androidx.media3", name = "media3-ui", version.ref = "media3" }
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
retrofit-converter-gson = { group = "com.squareup.retrofit2", name = "converter-gson", version.ref = "retrofit" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coil" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`);

    // App build & manifest
    zip.file('app/build.gradle.kts', `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.zaro.aivideo"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.zaro.aivideo"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.play.services.ads)
    implementation(libs.androidx.media3.exoplayer)
    implementation(libs.androidx.media3.ui)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.coil.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
}`);

    zip.file('app/proguard-rules.pro', `-keep class com.zaro.aivideo.data.model.** { *; }
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**`);

    zip.file('app/src/main/AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />

    <application
        android:name=".ZaroApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZaroAIVideo">
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.ZaroAIVideo">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);

    // Resources
    zip.file('app/src/main/res/values/strings.xml', `<resources>
    <string name="app_name">Zaro AI Video</string>
    <string name="nav_home">Home</string>
    <string name="nav_text_video">Text to Video</string>
    <string name="nav_image_video">Image to Video</string>
    <string name="nav_voice">Voice AI</string>
    <string name="nav_history">History</string>
    <string name="nav_profile">Profile</string>
    <string name="home_hero_title">Create Stunning AI Videos</string>
    <string name="home_hero_subtitle">Turn your ideas into cinematic videos with multilingual AI voiceovers.</string>
    <string name="btn_generate">Generate AI Video</string>
    <string name="prompt_hint">Describe the video you want to generate...</string>
    <string name="aspect_ratio">Aspect Ratio</string>
    <string name="video_style">Visual Style</string>
    <string name="camera_motion">Camera Motion</string>
    <string name="voice_language">Voice Language</string>
    <string name="watch_ad_reward">Watch Ad (+2 Credits)</string>
    <string name="premium_upgrade">Upgrade to VIP Pro</string>
</resources>`);

    zip.file('app/src/main/res/values-ur/strings.xml', `<resources>
    <string name="app_name">زارو اے آئی ویڈیو</string>
    <string name="nav_home">ہوم</string>
    <string name="nav_text_video">ٹیکسٹ سے ویڈیو</string>
    <string name="nav_image_video">تصویر سے ویڈیو</string>
    <string name="nav_voice">اے آئی آواز</string>
    <string name="nav_history">تاریخچہ</string>
    <string name="nav_profile">پروفائل</string>
    <string name="home_hero_title">شاندار اے آئی ویڈیوز بنائیں</string>
    <string name="home_hero_subtitle">اپنے خیالات کو خوبصورت ویڈیوز میں بدلیں۔</string>
    <string name="btn_generate">اے آئی ویڈیو بنائیں</string>
    <string name="prompt_hint">اپنی ویڈیو کی تفصیل یہاں لکھیں...</string>
    <string name="aspect_ratio">ویڈیو کا سائز</string>
    <string name="video_style">ویڈیو کا انداز</string>
    <string name="camera_motion">کیمرہ موشن</string>
    <string name="voice_language">آواز کی زبان</string>
    <string name="watch_ad_reward">اشتہار دیکھیں (+2 کریڈٹ)</string>
    <string name="premium_upgrade">وی آئی پی پرو حاصل کریں</string>
</resources>`);

    zip.file('app/src/main/res/values-hi/strings.xml', `<resources>
    <string name="app_name">ज़ारो एआई वीडियो</string>
    <string name="nav_home">होम</string>
    <string name="nav_text_video">टेक्स्ट से वीडियो</string>
    <string name="nav_image_video">फ़ोटो से वीडियो</string>
    <string name="nav_voice">एआई आवाज़</string>
    <string name="nav_history">इतिहास</string>
    <string name="nav_profile">प्रोफ़ाइल</string>
    <string name="home_hero_title">शानदार एआई वीडियो बनाएं</string>
    <string name="home_hero_subtitle">अपने विचारों को सिनेमाई वीडियो में बदलें।</string>
    <string name="btn_generate">एआई वीडियो बनाएं</string>
    <string name="prompt_hint">अपने वीडियो का विवरण यहाँ लिखें...</string>
    <string name="aspect_ratio">वीडियो अनुपात</string>
    <string name="video_style">विज़ुअल स्टाइल</string>
    <string name="camera_motion">कैमरा मोशन</string>
    <string name="voice_language">आवाज़ की भाषा</string>
    <string name="watch_ad_reward">विज्ञापन देखें (+2 क्रेडिट)</string>
    <string name="premium_upgrade">वीआईपी प्रो प्राप्त करें</string>
</resources>`);

    zip.file('app/src/main/res/values/themes.xml', `<resources>
    <style name="Theme.ZaroAIVideo" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#09090B</item>
        <item name="android:navigationBarColor">#09090B</item>
        <item name="android:windowBackground">#09090B</item>
    </style>
</resources>`);

    // Source Code
    zip.file('app/src/main/java/com/zaro/aivideo/ZaroApp.kt', `package com.zaro.aivideo
import android.app.Application
import com.google.android.gms.ads.MobileAds

class ZaroApp : Application() {
    override fun onCreate() {
        super.onCreate()
        MobileAds.initialize(this) {}
    }
}`);

    zip.file('app/src/main/java/com/zaro/aivideo/MainActivity.kt', `package com.zaro.aivideo
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.zaro.aivideo.ui.navigation.AppNavigation
import com.zaro.aivideo.ui.theme.ZaroAIVideoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ZaroAIVideoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    AppNavigation(navController = navController)
                }
            }
        }
    }
}`);

    // Generate zip and save
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ZaroAIVideo_AndroidStudio_Project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
