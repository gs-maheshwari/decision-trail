# Decision Trail - Angular Application

## Overview

This Angular application allows users to make choices in a decision-based game. Players navigate through a series of choices that lead them to different endings. The application tracks the player's choices, shows the path taken, and includes a visual representation of the decision tree at the end.

## Features

- **Choice Navigation**: Users can pick between two choices displayed on their screen to progress through the game.
- **Persistence of Choices**: The player's choices are stored and used to determine the path through the game.
- **Endings**: The game concludes when the player reaches one of the predefined endings.
- **Decision Tree Visualization**: Displays a decision tree diagram

## Requirements

- Angular (latest stable version)
- NgRx for state management
- Router for navigation
- HTTP client for fetching data
- Ngx-graph for visualizing the decision tree

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install and Run**

   ```bash
   npm install
   ng serve

3. **Test**

   ```bash
   ng test   