[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

![Logo](https://firebasestorage.googleapis.com/v0/b/whiner2-82d5e.appspot.com/o/YT_OCR-removebg-preview.png?alt=media&token=12ddd677-d70f-4fa1-84ce-46aabae63949)

# Youtube OCR - Read text from within a youtube video

This is a 100% client-side chrome extension which allows you to read text from witihin a youtube video.
This is achieved through the TesseractJS library which wraps the emscripten port of the original tesseract implementation.

## Motivation

- A lot of time when watching a YouTube video one come's across a text of some information or code which is of use but there is no way to get it except just typing it out. Eg shell commands in tutorial videos or some text in a news video. This extension solves this problem by allowing the user to copy plain text directly from the youtube video screen.

## Run Locally

Clone the project

```bash
  git clone https://github.com/msx47/youtube_ocr_extension.git
```

Go to the project directory

```bash
  cd youtube_ocr_extension
```

Install dependencies

```bash
  npm install
```

Build

```bash
  npm run build
```

Load unpacked in chrome extensions menu and select the build folder generated in the previos step.

## FAQ

#### How does this work ?

The extension programatically takes screensot of the area of the video you have selected and reads the text from it.

#### How is the text read ?

The text is read using the [TesseractJS](https://github.com/naptha/tesseract.js/) library. It makes use of service workers and web assembly to process the text through a pre-trained model.

#### Sometimes it doesn't read the text / reads wrong text. What's the issue?

As stated earlier this is based on a pre trained model which was trained for English text with around 2500 fonts. The font of your target text might be different or it might have text which isn't recognized by the engine. I am working on training new models but it will take some time.

#### Can it read code ?

If the code editor doesn't add indentation lines into the code then yes it can read code.

## Authors

- [@msx47](https://www.github.com/msx47)

## Roadmap

- Firefox support

- New models to support more fonts

- Improved UI
