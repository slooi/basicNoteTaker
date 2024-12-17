# # How to setup monorepo in pnpm #


# Step 1.0 Initialize the Monorepo
### 1.1 Create the root directory for your monorepo:
```sh
mkdir my-monorepo
cd my-monorepo
```
### 1.2 Initialize a new package.json in the root:
```sh
pnpm init
```
### 1.3 Add a pnpm-workspace.yaml file to define your workspace structure:
```sh
touch pnpm-workspace.yaml
```
### 1.4 Add the following content to pnpm-workspace.yaml:
```sh
packages:
  - "packages/**"
```


# 2.0 Create Sub-packages
### 2.1 Navigate to the packages folder:
```sh
mkdir packages
cd packages
```
### 2.2 Create the following subdirectories for your packages:
```sh
mkdir client server shared
```
### 2.3 Initialize each sub-package:
Client:
```sh
cd client
pnpm init
cd ..
```
Server:
```sh
cd server
pnpm init
cd ..
```
Shared:
```sh
    cd shared
    pnpm init
    cd ..
```
### 2.4 For each sub-package, update the package.json
Set name to something descriptive, e.g., `"@my-org/client"`, `"@my-org/server"`, and `"@my-org/shared"`.
Ensure version is specified (e.g., `"1.0.0"`).

# Step 3.0 Configure Dependencies
1. If the client and server need to use the shared package:
	- Add the shared package as a dependency in both client and server.
	- Run:
	```sh
	cd client
	pnpm add @my-org/shared --workspace
	cd ../server
	pnpm add @my-org/shared --workspace
	```
2. If the server depends on the client (or vice versa), follow the same process to link them.


# GOTCHA
You must call the file you are sharing `index.ts`. This is the **BARALLEL FILE**. The barallel file should be at the root of the directory.

# Validation
- Check if dependencies properly linked. Run in SUB-REPO to check sub-repo status and run in MAIN-REPO to check main-repo status!!!
`pnpm list`








# Slate
1. Remember to create your types and update the slate module
```ts
type CustomText = { text: string }
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CodeElement = { type: 'code'; children: CustomText[] }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Text: CustomText
    Element: CustomElement | CodeElement
  }
}
```