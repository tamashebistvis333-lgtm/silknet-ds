// swift-tools-version: 5.9
//
// Silknet design system — Swift Package Manager target.
// Distributes the design tokens as native Swift APIs:
//   - Color.silknet.<name>     — semantic colors that switch light/dark with system
//   - CGFloat.silknet.<name>   — spacing, radius
//   - Font.silknet.<name>      — composite text styles
//
// All sources under Sources/SilknetDS/ are auto-generated from the token
// pipeline (run `npm run build:swift` from the repo root). Do not edit by hand.

import PackageDescription

let package = Package(
    name: "SilknetDS",
    platforms: [
        // Bumped to iOS 16 — needed for the View.underline() modifier used by
        // SilknetButton (link variant). iOS 16 ships Sep 2022 so support is
        // universal at this point.
        .iOS(.v16)
    ],
    products: [
        .library(name: "SilknetDS", targets: ["SilknetDS"])
    ],
    targets: [
        .target(name: "SilknetDS", path: "Sources/SilknetDS")
    ]
)
