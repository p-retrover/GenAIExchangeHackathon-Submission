import json
from typing import Dict
from app.utils.prompt_loader import load_system_prompt_from_yaml as load_prompt
from app.ai.llm_provider import llm # <-- Imports from the shared provider

class RoadmapAgent:
    """
    An AI agent specialized in generating detailed learning roadmaps using LangChain.
    """
    def _construct_prompt(self, role_title: str, weeks: int) -> str:
        base_persona = load_prompt("satori_base_persona.txt")

        task_instructions = f"""
        **Your Current Task:**
        Generate a detailed, week-by-week learning roadmap for a student aspiring to become a "{role_title}". The total duration for this plan is {weeks} weeks.

        **Critical Rules:**
        - Your entire response MUST be a single, valid JSON object. Do not include any introductory text, closing remarks, or markdown formatting like ```json.

        **Required JSON Structure:**
        {{
          "role_title": "{role_title}",
          "total_weeks": {weeks},
          "overview": "A 2-3 sentence overview of the career and the learning journey.",
          "weekly_plan": [
            {{
              "week": 1,
              "theme": "A concise theme for the week (e.g., 'Foundations of Python')",
              "objectives": ["A list of 2-3 specific, measurable learning objectives."],
              "resources": [
                {{
                  "type": "video" | "article" | "documentation" | "project",
                  "title": "A descriptive title for the resource",
                  "url": "A valid, direct URL to the resource"
                }}
              ]
            }}
          ]
        }}
        """
        return f"{base_persona}\n\n{task_instructions}"

    async def run(self, role_title: str, weeks: int = 12) -> Dict:
        """
        Executes the agent's task to generate a learning roadmap.
        """
        prompt = self._construct_prompt(role_title, weeks)

        try:
            response = await llm.ainvoke(prompt)

            json_start = response.content.find('{')
            json_end = response.content.rfind('}') + 1
            clean_json_str = response.content[json_start:json_end]

            ai_response = json.loads(clean_json_str)
            return ai_response
        except Exception as e:
            print(f"Error in RoadmapAgent (run method): {e}")
            print(f"Raw AI response was: {getattr(response, 'content', 'N/A')}")
            return {"error": f"Failed to generate or parse AI roadmap for {role_title}."}

# Create a single, reusable instance of the agent
roadmap_agent = RoadmapAgent()