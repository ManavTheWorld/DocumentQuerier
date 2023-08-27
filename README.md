
# Trench LLC Gen AI Web App
## Getting Started

### Overview

This WebApp is a prototype product that uses LLAMA2 and LLAMA Index to leverage open source large language models to achieve the same functionality that CHAT-GPT offers on localized, secure hardware. This is especially useful for querying sensitive information, such as financial records, legal contracts, and confidential/company secret files. No API calls are being made, and instead the app is dependent on local hardware to run. For this reason, testing this application on high-memory GPU-accelerated hardware is recommended. Prefarably those of NVIDIA GPUS that are CUDA enabled.

The application's stack uses NextJS and Python, using Flask to handle cross-server requests.

### Hardware Requirements

Currently, three models are preconfigured already within the scope of this project:
* LLaMA2 CHAT 7B (GPTQ)
* LLaMA2 CHAT 13B (GPTQ)
* LLaMA2 CHAT 30B (GPTQ)

GPTQ models are efficiently trained on GPU hardware. If training on CPU memory, please add GGML models in the `backend/constants.py` file.

The hardware needed to run these models depends on bit size. The default LLaMA2 models use floating point precision (16bit), meaning they are twice as large as their parameter size. For example, if running 30B at default bit size, ~60GB of VRAM would be required to run the model and load the weights. I have set the default model and revision to LLAMA2 13B 8bit, meaning roughly 13-15GB of VRAM is required, as the parameter size is halved. If using the default settings, an RTX 3090 or better would be required.

To change this to run on an RTX 3080, for example, navigate to the `backend/init_llama.py` file and change the `model_name_or_path` variable to the 7b model in the constants.

## Installation

### Prerequisites

For this application, you must have:
```
- Python 3.10-3.11
- Node JS v18.x or higher
- NVIDIA CUDA (if using a GPTQ model): https://developer.nvidia.com/cuda-downloads
- A HuggingFace personal access token: https://huggingface.co/
- At least 20GB of disk space to download the model
```

### Instructions

**It is strongly recommended to use the Windows Subsystem for Linux if using a Windows Computer: https://learn.microsoft.com/en-us/windows/wsl/install**

1. Clone this repository
2. Create a new Python virtual environment in the root directory. `python -m venv venv`
3. Activate the virtual environment. `source /venv/bin/activate` on UNIX/Mac based software, or `. /venv/Scripts/activate` on Windows
4. Download the required Python packages. `pip install -r requirements.txt`
5. Download the correct Auto GPTQ package .whl file for your system. https://github.com/PanQiWei/AutoGPTQ/releases
6. Install Auto GPTQ with `pip install -f {path to downloaded .whl file}`
7. Install the Node Packages. `npm install`

## Running the Application

1. Run the application with `npm start`. This will start the frontend and backend server.
2. Upload a document you want to query.
3. Generate document embeddings and start the AI. Click the blue button.
4. 2. If you are starting it for the first time, have your HuggingFace PAT ready and paste it in when prompted. The models will download before it runs.
5. Once loaded, a chat window will appear and you can query the AI about your documents.
