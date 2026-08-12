# Paper Doll - WFRP4e migration package

This package has moved to [WFRP4e Compatibility Box](https://github.com/jeremyglebe/wfrp4e-compatibility-box).

Version 1.0.0 is an intentionally code-free migration release. Updating this legacy package tells
Foundry to install and enable WFRP4e Compatibility Box while preserving this package ID for existing
installations and update checks. The maintained Paper Doll patches now run exclusively from the new
module.

## Installation

Existing users can update this package normally. For a new installation, install WFRP4e
Compatibility Box directly with this manifest URL:

```text
https://github.com/jeremyglebe/wfrp4e-compatibility-box/releases/latest/download/module.json
```

Enable **Paper Doll** and **WFRP4e Compatibility Box** in your world. The Compatibility Box only
exposes its Paper Doll feature setting while Paper Doll is active.

## Compatibility

- Module ID: `paper-doll-wfrp4e`
- Current version: `1.0.0`
- Foundry VTT: minimum 14, verified 14
- Required modules: fvtt-paper-doll-ui 3.0.0, wfrp4e-compatibility-box 1.0.0
- Required system: wfrp4e 9.6.1

## Links

- [Latest release](https://github.com/jeremyglebe/paper-doll-wfrp4e/releases/latest)
- [Foundry manifest](https://github.com/jeremyglebe/paper-doll-wfrp4e/releases/latest/download/module.json)
- [Public artifact repository](https://github.com/jeremyglebe/paper-doll-wfrp4e)

## Repository contents

This public repository contains the installable migration manifest and release documentation. It has
no scripts, styles, hooks, or patches of its own.

```text
.
├── .github/workflows/release.yml  Packages tagged releases
├── module.json                    Foundry module manifest
└── README.md                      Installation and compatibility information
```
