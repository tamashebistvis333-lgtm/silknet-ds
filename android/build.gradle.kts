// Top-level Gradle build file. Plugin versions are declared here so the
// :library module can reference them without a version. Compose support is
// provided by the Kotlin 2.x compose compiler plugin (no separate AGP option
// or Compose compiler version pin required).

plugins {
    id("com.android.library") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.20" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20" apply false
    id("maven-publish") apply false
}
