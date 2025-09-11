import json
from typing import Dict, Any
from app.ai.llm_provider import llm  # <-- Import the new LangChain LLM

class RecommendationAgent:
    """
    An AI agent specialized in generating career recommendations using LangChain.
    """
    def _construct_prompt(
        self, career_profile: Dict[str, float], user_data: Dict[str, Any]
    ) -> str:
        profile_str = ", ".join([f"{k}: {v:.1f}" for k, v in career_profile.items()])

        return f"""
        **Persona:** You are "Satori," an expert career counselor for students in India. Your advice is insightful, realistic, and encouraging.

        **User Context:** You are advising a student with the following profile:
        - **Career Archetype Scores (RIASEC Holland Codes):** {profile_str}
        - **Personal Bio:** {user_data.get('bio', 'Not provided.')}
        - **Stated Interests:** {', '.join(user_data.get('interests', ['Not provided.']))}

        **Task:** Generate 3 distinct and personalized career recommendations.

        **Output Format:** Your response MUST be a single, valid JSON object following this exact structure:
        {{
          "roles": [
            {{
              "role_id": "unique-id-for-role",
              "title": "Career Title",
              "fit_reason": "A concise explanation of why this role is a good fit based on the user's profile.",
              "pros": ["A list of 3 concise pros"],
              "cons": ["A list of 3 concise cons"],
              "opportunity_score": 8.5,
              "feasibility_score": 7.0
            }}
          ]
        }}
        """

    async def run(
        self, career_profile: Dict[str, float], user_data: Dict[str, Any]
    ) -> Dict:
        """
        Executes the agent's task to generate career recommendations.
        """
        prompt = self._construct_prompt(career_profile, user_data)
        
        try:
            response = await llm.ainvoke(prompt)

            # --- FIX: Clean the markdown from the AI's response ---
            # Find the start and end of the actual JSON content
            json_start = response.content.find('{')
            json_end = response.content.rfind('}') + 1
            clean_json_str = response.content[json_start:json_end]

            # Now parse the cleaned string
            ai_response = json.loads(clean_json_str)
            return ai_response
        except Exception as e:
            print(f"Error in RecommendationAgent (run method): {e}")
            # Add the raw response to the log for better debugging if it fails again
            print(f"Raw AI response was: {getattr(response, 'content', 'N/A')}")
            return {"error": "Failed to generate or parse AI recommendations."}

# Single instance of our agent
recommendation_agent = RecommendationAgent()