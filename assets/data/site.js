/*
 * All site content that changes over time lives here.
 *
 * To add a new course: copy one entry in `courses`, give it a unique `slug`,
 * and fill in the fields. Set `featured: true` on the course the homepage
 * should spotlight (only one). Set `status: "soon"` to show it as coming soon
 * without an enroll button.
 */
window.SITE = {
  owner: {
    name: "Seyed Vahid Mirnezami",
    firstName: "Vahid",
    github: "seyedvahidmirnezami",
    linkedin: "https://www.linkedin.com/in/seyedvahidmirnezami",
  },

  courses: [
    {
      slug: "transformers",
      featured: true,
      status: "live", // "live" or "soon"
      title: "Master Transformers from Scratch: BERT, ViT & AI Search",
      shortTitle: "Transformers from Scratch",
      tagline: "From vectors and attention math to BERT, Vision Transformers and two-tower semantic search.",
      url: "https://www.udemy.com/course/master-transformers-from-scratch-bert-vit-ai-search/?referralCode=741D2251A98D41859FB9",
      image: "assets/img/og-cover.jpg",
      tags: ["NLP", "Vision", "Search", "PyTorch"],
      sessionsLabel: "17 sessions",
      coInstructor: { name: "Mohammad R. Khalili Shoja", url: "https://github.com/khalili65" },
      pillars: [
        { icon: "numbers", color: "cyan", title: "Real numbers first",
          text: "Self-attention, Q/K/V and multi-head attention computed by hand on a three-word sentence, so every formula has a number you can check." },
        { icon: "code", color: "amber", title: "Then build it in PyTorch",
          text: "Tensors, autograd and <code>nn.Module</code>, then a BERT-style masked language model written layer by layer." },
        { icon: "star", color: "violet", title: "Then ship real projects",
          text: "Text classification, named entity recognition, distillation, Vision Transformers and two-tower semantic search on real Kaggle data." },
      ],
      ctaTitle: "Interview-ready intuition and working code, in one place.",
      ctaSub: "A guide for every session, and runnable code for every project.",
      tracks: [
        { name: "Attention math", range: "0–7", lessons: [
          [0, "Vectors, Dot Products, and Matrices"],
          [1, "Why Attention? From Ambiguity to Context"],
          [2, "Self-Attention with Real Numbers", "self-attention-from-scratch"],
          [3, "Making Attention Learnable: Query, Key, and Value", "self-attention-from-scratch"],
          [4, "Multi-Head Attention", "self-attention-from-scratch"],
          [5, "The Transformer Encoder Block", "transformer-encoder-pytorch"],
          [6, "Positional Encoding", "transformer-encoder-pytorch"],
          [7, "BERT: The Encoder in the Wild"],
        ]},
        { name: "PyTorch", range: "8–10", lessons: [
          [8, "Tensors, Shape & the Tree Mental Model"],
          [9, "Autograd & nn.Module"],
          [10, "Data Pipelines & Layer Containers"],
        ]},
        { name: "BERT projects", range: "11–14", lessons: [
          [11, "BERT-Base Masked Language Model Pretraining in PyTorch"],
          [12, "Fine-Tune BERT for Disaster Tweet Classification"],
          [13, "Fine-Tune BERT for Named Entity Recognition"],
          [14, "Knowledge Distillation and DistilBERT"],
        ]},
        { name: "Vision & search", range: "15–16", lessons: [
          [15, "Vision Transformers and Cassava Leaf Disease", "vision-transformer-cassava"],
          [16, "Two Towers From Scratch: Semantic Search", "semantic-search-two-tower"],
        ]},
      ],
    },
  ],

  // Free code. `course` links each repo to a course slug above.
  repos: [
    { name: "self-attention-from-scratch", course: "transformers", sessions: "Sessions 2–4",
      desc: "Self-attention explained with real numbers, then built in NumPy and PyTorch. Tests check every hand-worked number.",
      tags: ["attention", "numpy", "pytorch"] },
    { name: "transformer-encoder-pytorch", course: "transformers", sessions: "Sessions 5–6",
      desc: "The full encoder block from scratch, plus an experiment: 50% accuracy without positional encoding, 100% with it.",
      tags: ["encoder", "positional-encoding", "pytorch"] },
    { name: "vision-transformer-cassava", course: "transformers", sessions: "Session 15",
      desc: "Fine-tune a Vision Transformer on Kaggle cassava leaf photos, from patches to a competition submission.",
      tags: ["vit", "computer-vision", "kaggle"] },
    { name: "semantic-search-two-tower", course: "transformers", sessions: "Session 16",
      desc: "Two-tower retrieval and cross-encoder re-ranking, built by hand from a plain transformer encoder.",
      tags: ["retrieval", "embeddings", "kaggle"] },
  ],
};
