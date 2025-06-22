# Changelog

## [0.0.0] - 2025-06-22

## Templates

Initial Commit

### Added
- Implemented user profile customization options (avatar, bio, themes).
- Added support for dark mode, respecting system preferences.
- New API endpoint `/users/{id}/profile` for fetching user profile data.

### Changed
- Improved performance of data loading on the dashboard by optimizing queries.
- Updated styling of navigation bar for better responsiveness on mobile devices.

### Fixed
- Resolved an issue where long user names caused overflow in the header.
- Fixed a bug where search results were not consistently filtered by tags.

## [1.1.0] - 2025-05-15

### Added
- Introduced a new "Favorites" feature for users to bookmark items.
- Added pagination to the main listing view for better performance.

### Changed
- Refactored authentication module for improved security and maintainability.
- Updated third-party dependency `lodash` to v4.17.21 for security patches.

### Fixed
- Corrected a typo in the error message for invalid email format.
- Addressed an edge case where empty search queries crashed the application.

## [1.0.0] - 2025-04-01

### Added
- Initial release of the "My Awesome App" application.
- User registration and login functionality.
- Basic data listing and detail views.

### Security
- Implemented robust password hashing with Argon2.

## [0.9.0] - 2025-03-10

### Added
- Implemented initial user authentication module.
- Basic "Hello World" display.

### Changed
- Switched from a simple data mock to a local JSON server for data.

### Fixed
- Resolved issue with incorrect character encoding in some text fields.