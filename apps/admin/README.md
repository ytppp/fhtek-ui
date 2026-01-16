## fhtek-web-api-demo

fhtek web pages, each router is in a directory.

## How to run

### for dev

```sh
make dev CUSTOMER_ID=xxxx // CUSTOMER_ID should be oneof (demo fhtek totalplay)
```

### for build

```sh
make build CUSTOMER_ID=xxxx // CUSTOMER_ID should be oneof (demo fhtek totalplay)
```

## how to get i18n data

[FHTEK-DOCS repository](https://codehub.devcloud.cn-east-3.huaweicloud.com/FHTEK-DOCS00002/FHTEK-DOCS.git)

```sh
./i18n.sh main // main is the branch name of FHTEK-DOCS repository
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
