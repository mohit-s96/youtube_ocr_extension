[![MIT License](https://img.shields.io/github/license/mohit-s96/youtube_ocr_extension)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![Logo](/assets/favicon.png)

## For Manifest V2 check out the [manifest-v2 branch](https://github.com/mohit-s96/youtube_ocr_extension/tree/manifest-v2)

# Youtube OCR - Read text from within a YouTube video

This is a 100% client-side Chrome extension that allows you to read text from within a YouTube video.
This is achieved through the TesseractJS library which wraps the emscripten port of the original Tesseract implementation.

## Usage

Start by clicking the 'Start Crop' button from the extension popup or by using the shortcut `Cmd + Shift + o` (mac) or `Ctrl + Shift + o`.

## Motivation

- A lot of times when watching a YouTube video you come across a text of some information or code which is of use but there is no way to get it except just typing it out. Eg shell commands in tutorial videos or some text in a news video. This extension solves this problem by allowing the user to copy plain text directly from the YouTube video screen.

## Run Locally

Clone the project

```bash
  git clone https://github.com/mohit-s96/youtube_ocr_extension.git
```

Go to the project directory

```bash
  cd youtube_ocr_extension
```

Install dependencies

```bash
  yarn install
```

Build

```bash
  yarn build
```

Load unpacked in the Chrome extensions menu and select the build folder generated in the previous step.

## FAQ

#### How does this work?

The extension programmatically takes screenshots of the area of the video you have selected and reads the text from it.

#### How is the text read?

The text is read using the [TesseractJS](https://github.com/naptha/tesseract.js/) library. It makes use of service workers and web assembly to process the text through a pre-trained model.

#### Sometimes it doesn't read the text / reads the wrong text. What's the issue?

As stated earlier this is based on a pre-trained model which was trained for English text with around 2500 fonts. The font of your target text might be different or it might have text which isn't recognized by the engine. I am working on training new models but it will take some time.

#### Can it read code?

If the code editor doesn't add indentation lines into the code then yes it can read code.

## Authors

- [@mohit-s96](https://www.github.com/mohit-s96)

## Roadmap

- Firefox support

- New models to support more fonts