from graphviz import Digraph
import os

def create_flow_diagram():
    # Initialize a new directed graph
    dot = Digraph('MedicalLMMFlow', node_attr={'style': 'filled', 'shape': 'box', 'fontname': 'Calibri'})

    # Add nodes representing each step of the process
    dot.node('A', label='<Patient Data<BR /><FONT POINT-SIZE="10">Symptoms, History, Tests<BR />Transmitted Securely: Encryption, Local Servers</FONT>>', fillcolor='lightblue')
    dot.node('F', label='<External API<BR /><FONT POINT-SIZE="10">Feeds in Research Articles</FONT>>', fillcolor='lightcyan')
    dot.node('G', label='<Hospital Data<BR /><FONT POINT-SIZE="10">Relevant Hospital Records</FONT>>', fillcolor='orange')

    # LMM Cluster to indicate interchangeability and include Transformer Validator
    with dot.subgraph(name='cluster_LMM') as c:
        c.attr(label='<LMM Processing<BR /><FONT POINT-SIZE="10">(Interchangeable: e.g., PaLM2)</FONT>>', rank='same')
        c.node('H', label='<Transformer Validator<BR /><FONT POINT-SIZE="10">Ensures Non-hallucinatory Responses<BR />Using Entity Extraction</FONT>>', fillcolor='lavender')
        c.node('B', label='<LMM Model<BR /><FONT POINT-SIZE="10">Processes patient data &amp;<BR />Queries External API</FONT>>', fillcolor='lightgray')
        c.edge('H', 'B')  # Edge from Transformer Validator to LMM Model

    # Frontend UI Cluster encapsulating the output values
    with dot.subgraph(name='cluster_UI') as c:
        c.attr(label='Frontend UI for Doctors', style='dashed')
        c.node('I', '', style='invis', width='0')
        c.node('C', label='<Medical Literature Synthesis<BR /><FONT POINT-SIZE="10">Integration of research articles and hospital data</FONT>>', fillcolor='lightyellow')
        c.node('D', label='<Differential Diagnoses Output<BR /><FONT POINT-SIZE="10">Generated list based on data</FONT>>', fillcolor='lightpink')
        c.node('E', label='<Cited Medical References<BR /><FONT POINT-SIZE="10">Relevant literature sources</FONT>>', fillcolor='lightgreen')

    # Connect nodes to indicate the flow
    dot.edge('A', 'B', dir='e')
    dot.edge('B', 'F', label='Queries', dir='e')
    dot.edge('A', 'G', dir='w')
    dot.edge('G', 'B', dir='w')
    dot.edge('B', 'D', dir='ne')  # Direct connection from LMM model to Diagnoses output
    dot.edge('D', 'C', dir='e')  # Bi-directional arrow
    dot.edge('C', 'D', dir='w')  # Bi-directional arrow
    dot.edge('D', 'E', dir='e')  # Bi-directional arrow
    dot.edge('E', 'D', dir='w')  # Bi-directional arrow

    # Save and render the diagram
    dot.view()

if __name__ == "__main__":
    create_flow_diagram()
