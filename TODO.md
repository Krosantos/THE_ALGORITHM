- Switch NN use to a Bayes probabilistic regressor:
  * Order of cards does not matter
  * Cards are individually represented to a likelihood of winning
  * Player is another factor
  * Might need to implement a one-hot encoder in order to map from card/player names to IDs
- Add a utility that automatically pulls all cards by deck name from Sheets
- Actually add some historical games
