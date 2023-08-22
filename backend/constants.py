
class SECRETS:
    class KEYS:
        OPEN_AI_KEY = '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'


class MODELS:
    class CHAT_LLMS:
        thebloke_30b = 'TheBloke/hippogriff-30b-chat-GPTQ'
        thebloke_13b = 'TheBloke/CodeUp-Llama-2-13B-Chat-HF-GPTQ'
    class EMBED_MODELS:
        sentence_transformers_all_mpnet_base_v2 = 'sentence-transformers/all-mpnet-base-v2'

class REVISIONS:
    main = 'main'
    four_bit_32g = 'gptq-4bit-32g-actorder_True'
    eight_bit_32g = 'gptq-8bit-32g-actorder_True'
    four_bit_64g = 'gptq-4bit-64g-actorder_True'
    eight_bit_64g = 'gptq-8bit-64g-actorder_True'
    four_bit_128g = 'gptq-4bit-128g-actorder_True'
    eight_bit_128g = 'gptq-8bit-128g-actorder_True'