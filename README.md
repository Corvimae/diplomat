# Diplomat

A highly-configurable Pokemon catch tracker for speedruns.

## Todo
- Actually let you click on Pokemon in the tracker.
- Editable list to select Pokemon for each profile.

## Development

```bash
yarn
yarn start
```

## Troubleshooting

## WSL "SUID sandbox helper binary" issue

```bash
sudo chown root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

## Can't debug in VS Code

In `node_modules/@electron-forge/cli/script/vscode.cmd` and `node_modules/@electron-forge/cli/script/vscode.sh`, change the three `../` to one `../`.

```bash
node $DIR/../@electron-forge/cli/dist/electron-forge-start --vscode -- \~$ARGS\~
```