# Add project specific ProGuard rules here.
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.jetbrains.annotations.Nullable <fields>;
}

# Retrofit & Gson rules
-keepattributes Signature
-keepattributes Exceptions
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Keep Model classes
-keep class com.zaro.aivideo.data.model.** { *; }

# Google Play Services Ads
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**
