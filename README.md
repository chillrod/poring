# 🐽 Hi poring

Poring is a library that parse and translate JSON files using the open source api LibreTranslate

## How

We currently use the format of a CLI

Our steps are

Ask for the file and the language provided on the file,
then we read and parse the JSON and collect the remaining languages supported.

The start language provided serves as a "source" language to make requests to
[LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) services...

Then after the JSON keys are translated, we save the file in a new folder on the directory that the script was initiated.

The prefix of the fale are the target language and the same given file name.

Ex:

```bash
/locales/en-file.json
```

## Why

This project serve as a part of study of CLI environments. And node environment in general.

But... I made it to help me and my work colleagues with locale translation of our services.

So, this project main idea is to help people... So we accept help as well.

LibreTranslate itself is open source, so...
Poring accept's contribution and free usage of this written code.

If you want to contribute, just open a PR/Issue or contact me at

chillrod77@gmail.com

---

## Usage

First you have to install this library in a global environment.

For npm users

```javascript
npm i -g poring
```

Or for yarn users

```javascript
yarn global add poring
```

Then just run
`poring` in the directory that contains the .json file you want to translate.

Simple as that.

#### License

beto/opensource
