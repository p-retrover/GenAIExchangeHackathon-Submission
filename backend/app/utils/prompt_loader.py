import yaml
from pathlib import Path

def load_system_prompt_from_yaml(yaml_path: str) -> str:
    """
    Loads the Satori system prompt from a YAML file and converts it into
    a detailed, markdown-formatted string for an LLM.
    """
    path = Path(yaml_path)
    if not path.exists():
        return "Error: System prompt configuration file not found."

    with open(path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f).get("satori_system_prompt", {})

    # Helper to build consistent sections
    def build_section(title, content):
        return f"## {title}\n{content}"

    # --- Prepare content for each section ---

    # Identity & Persona
    identity = config.get("identity_and_persona", {})
    persona_content = (
        f"You are **{identity.get('name', 'Satori')}**, {identity.get('role', '')}.\n"
        f"Your name means *'{identity.get('meaning', '')}'* — your mission is to **{identity.get('mission', '')}**.\n"
        f"Your tone is **{', '.join(identity.get('tone', []))}**.\n"
        f"You communicate in clear **English** but understand **Hinglish**."
    )

    # Purpose
    purpose_content = "\n".join([f"- {item}" for item in config.get("purpose", [])])

    # Rules & Guardrails
    grounding = config.get("knowledge_and_grounding", {})
    grounding_rules = "\n".join([f"- {rule}" for rule in grounding.get("rules", [])])
    grounding_content = f"### Knowledge & Grounding\nYour single source of truth is the **{grounding.get('source_of_truth')}**.\n{grounding_rules}"

    ethics = config.get("safety_and_ethics", {})
    ethics_content = (
        f"### Safety & Ethics\n"
        f"- You are a **{ethics.get('role_limits')}**.\n"
        f"- Distress protocol: {ethics.get('distress_protocol')}.\n"
        f"- Your advice must be **bias-free**: {ethics.get('fairness')}.\n"
        f"- You **must never** ask for or store PII: {ethics.get('pii')}."
    )
    rules_content = f"{grounding_content}\n\n{ethics_content}"

    # Interaction Model
    comm_style = config.get("communication_style", {})
    comm_structure = "\n".join([f"{i+1}. {step}" for i, step in enumerate(comm_style.get('structure', []))])
    interaction_philosophy = config.get('interaction_philosophy', {})
    interaction_content = (
        f"**Communication Structure:**\n{comm_structure}\n\n"
        f"**Tone Adaptation:**\n- For **beginners**: {interaction_philosophy.get('beginners')}\n"
        f"- For **intermediate** learners: {interaction_philosophy.get('intermediate')}\n"
        f"- For **advanced** learners: {interaction_philosophy.get('advanced')}"
    )

    # Tools
    tools = config.get("tools", [])
    tools_list = "\n".join([f"- `{t['name']}`: {t['description']}" for t in tools])
    tools_content = f"You have access to the following functions to get factual information:\n{tools_list}"

    road_cfg = config.get("roadmap_context", {})
    roadmap_content = road_cfg.get("instructions").replace("{roadmap_context}", "{roadmap_context}")
    roadmap_section = build_section("ROADMAP CONTEXT", roadmap_content)

    # --- Assemble the final prompt using the section builder ---
    prompt_sections = [
        build_section("IDENTITY AND PERSONA", persona_content),
        build_section("CORE PURPOSE", purpose_content),
        build_section("RULES AND GUARDRAILS", rules_content),
        build_section("INTERACTION MODEL", interaction_content),
        build_section("TOOLS", tools_content),
        roadmap_section,
    ]

    return "\n\n".join(prompt_sections)