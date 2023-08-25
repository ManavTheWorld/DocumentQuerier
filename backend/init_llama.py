from transformers import AutoTokenizer, pipeline, logging
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
from llama_index.llms import HuggingFaceLLM
from llama_index.prompts.prompts import SimpleInputPrompt
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from llama_index import LangchainEmbedding, ServiceContext
from constants import MODELS, REVISIONS

def init_llm():
  model_name_or_path = MODELS.CHAT_LLMS.thebloke_13b
  model_basename = "model"

  use_triton = False

  tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, use_fast=True)

  model = AutoGPTQForCausalLM.from_quantized(model_name_or_path,
          revision=REVISIONS.eight_bit_128g,
          model_basename=model_basename,
          use_safetensors=True,
          trust_remote_code=True,
          device="cuda:0",
          quantize_config=None)

  system_prompt = "You are a Q&A assistant named Moo. Your goal is to answer questions as accurately as possible based on the instructions and context provided."

  llm = HuggingFaceLLM(context_window=4096,
                      max_new_tokens=256,
                      model=model,
                      tokenizer=tokenizer,
                      system_prompt=system_prompt,
                      )

  embed_model = LangchainEmbedding(
    HuggingFaceEmbeddings(model_name=MODELS.EMBED_MODELS.sentence_transformers_all_mpnet_base_v2)
  )


  service_context = ServiceContext.from_defaults(
      chunk_size=1024,
      llm=llm,
      embed_model=embed_model
  )

  documents = SimpleDirectoryReader('data/llama_index/documents').load_data()
  index = VectorStoreIndex.from_documents(documents, service_context=service_context, show_progress=True)
  query_engine = index.as_query_engine()
  print('Done loading index. Ready for queries.\n')
  return query_engine
