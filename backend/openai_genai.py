from constants import SECRETS
import os
os.environ["OPENAI_API_KEY"] = SECRETS.KEYS.OPEN_AI_KEY
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext

service_context = ServiceContext.from_defaults(chunk_size=512)
documents = SimpleDirectoryReader('documents').load_data()
index = VectorStoreIndex.from_documents(documents, service_context=service_context, show_progress=True)
query_engine = index.as_query_engine()

while True:
  query=input()
  response = query_engine.query(query)
  print(response)
  print('====================\n')