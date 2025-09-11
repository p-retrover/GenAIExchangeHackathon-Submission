import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal, engine
from app.models.assessment import Assessment, Question, Choice
from app.db.base import Base

async def create_questionnaire():
    async with engine.begin() as conn:
        # This command is safe and will not delete existing tables
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Assessment).where(Assessment.title == "Satori Career Compass")
        )
        if result.scalars().first():
            print("Questionnaire already exists. Aborting.")
            return

        print("Creating the Satori Career Compass questionnaire...")
        
        # ... (rest of the script is the same) ...
        new_assessment = Assessment(
            title="Satori Career Compass",
            description="Answer these questions to help us understand your interests and strengths."
        )
        session.add(new_assessment)
        await session.flush()

        questions_data = [
            {
                "text": "When faced with a complex problem, what is your first instinct?",
                "type": "multiple_choice",
                "category": "Problem Solving",
                "choices": [
                    {"text": "Break it down into smaller, logical steps.", "archetype": "Analyst"},
                    {"text": "Brainstorm creative and unconventional solutions.", "archetype": "Innovator"},
                    {"text": "Research how others have solved similar problems.", "archetype": "Investigator"},
                    {"text": "Organize a team and delegate parts of the problem.", "archetype": "Leader"}
                ]
            },
            {
                "text": "Which of these work environments sounds most appealing?",
                "type": "multiple_choice",
                "category": "Work Style",
                "choices": [
                    {"text": "A structured, stable environment with clear expectations.", "archetype": "Guardian"},
                    {"text": "A dynamic, fast-paced startup where I can wear many hats.", "archetype": "Adventurer"},
                    {"text": "A collaborative and social team-based environment.", "archetype": "Connector"},
                    {"text": "Working independently on my own schedule.", "archetype": "Creator"}
                ]
            },
            {
                "text": "What kind of tasks do you find most satisfying?",
                "type": "multiple_choice",
                "category": "Interests",
                "choices": [
                    {"text": "Building something tangible with my hands or with code.", "archetype": "Maker"},
                    {"text": "Helping and advising people with their problems.", "archetype": "Mentor"},
                    {"text": "Analyzing data and finding patterns to make decisions.", "archetype": "Analyst"},
                    {"text": "Designing something visually appealing and user-friendly.", "archetype": "Designer"}
                ]
            },
        ]

        # New questions to be added, matching the new archetype structure
        new_questions_data = [
            # Category: Work Style
            {
                "text": "How do you prefer to plan your workday?",
                "type": "multiple_choice",
                "category": "Work Style",
                "choices": [
                    {"text": "A detailed, hour-by-hour schedule planned in advance.", "archetype": "Guardian"},
                    {"text": "A flexible to-do list that can adapt to new priorities.", "archetype": "Adventurer"},
                    {"text": "Focusing on one major task and seeing it through to completion.", "archetype": "Maker"},
                    {"text": "Blocking out time for meetings and collaborative sessions.", "archetype": "Connector"}
                ]
            },
            # Category: Interests
            {
                "text": "Which of these subjects are you most drawn to?",
                "type": "multiple_choice",
                "category": "Interests",
                "choices": [
                    {"text": "Psychology and understanding what motivates people.", "archetype": "Mentor"},
                    {"text": "Economics and understanding how systems work.", "archetype": "Analyst"},
                    {"text": "Art and aesthetics, focusing on form and color.", "archetype": "Designer"},
                    {"text": "Technology and how new tools are built and used.", "archetype": "Innovator"}
                ]
            },
            # Category: Core Motivators
            {
                "text": "What is the most important outcome of your work?",
                "type": "multiple_choice",
                "category": "Core Motivators",
                "choices": [
                    {"text": "Creating something novel that didn't exist before.", "archetype": "Creator"},
                    {"text": "Achieving a difficult, measurable goal.", "archetype": "Leader"},
                    {"text": "Discovering a new insight or piece of knowledge.", "archetype": "Investigator"},
                    {"text": "Ensuring a system is stable, reliable, and secure.", "archetype": "Guardian"}
                ]
            },
            {
                "text": "You're given a new, major project. What excites you the most?",
                "type": "multiple_choice",
                "category": "Core Motivators",
                "choices": [
                    {"text": "The opportunity to lead the team to success.", "archetype": "Leader"},
                    {"text": "The chance to learn a new technology or skill.", "archetype": "Investigator"},
                    {"text": "The freedom to design the solution from the ground up.", "archetype": "Creator"},
                    {"text": "The impact the project will have on users or the community.", "archetype": "Mentor"}
                ]
            },
            # Category: Interpersonal Style
            {
                "text": "In a team discussion, you are most likely to be the one...",
                "type": "multiple_choice",
                "category": "Interpersonal Style",
                "choices": [
                    {"text": "Asking deep, probing questions to uncover details.", "archetype": "Analyst"},
                    {"text": "Making sure everyone feels heard and is included.", "archetype": "Connector"},
                    {"text": "Presenting a strong, well-reasoned argument for your viewpoint.", "archetype": "Leader"},
                    {"text": "Sketching out ideas on a whiteboard to visualize concepts.", "archetype": "Designer"}
                ]
            },
            {
                "text": "How do you prefer to communicate complex ideas?",
                "type": "multiple_choice",
                "category": "Interpersonal Style",
                "choices": [
                    {"text": "Through a well-structured written document or report.", "archetype": "Guardian"},
                    {"text": "With visual aids like diagrams, mockups, or presentations.", "archetype": "Designer"},
                    {"text": "By building a working prototype to demonstrate the concept.", "archetype": "Maker"},
                    {"text": "In a face-to-face conversation where I can answer questions.", "archetype": "Connector"}
                ]
            },
            # Category: Learning Style
            {
                "text": "How do you best learn a new, complex software tool?",
                "type": "multiple_choice",
                "category": "Learning Style",
                "choices": [
                    {"text": "By reading the official documentation from start to finish.", "archetype": "Investigator"},
                    {"text": "By following a structured video tutorial series.", "archetype": "Guardian"},
                    {"text": "By immediately trying to build a small project with it.", "archetype": "Maker"},
                    {"text": "By finding an expert and asking them to show me the ropes.", "archetype": "Mentor"}
                ]
            },
            # Category: Task Preference
            {
                "text": "Which of these tasks sounds the most engaging?",
                "type": "multiple_choice",
                "category": "Task Preference",
                "choices": [
                    {"text": "Optimizing a process to make it 10% more efficient.", "archetype": "Analyst"},
                    {"text": "Crafting a compelling story or presentation.", "archetype": "Connector"},
                    {"text": "Fixing a complex bug in a piece of software or machinery.", "archetype": "Maker"},
                    {"text": "Coming up with a completely new product idea.", "archetype": "Innovator"}
                ]
            },
            {
                "text": "Do you prefer to start a project from scratch or improve an existing one?",
                "type": "multiple_choice",
                "category": "Task Preference",
                "choices": [
                    {"text": "From scratch. I love a blank canvas.", "archetype": "Creator"},
                    {"text": "Improve an existing one. I enjoy making things better.", "archetype": "Analyst"},
                    {"text": "It doesn't matter, as long as the problem is interesting.", "archetype": "Investigator"},
                    {"text": "I prefer joining a project that already has momentum.", "archetype": "Connector"}
                ]
            },
            # Category: Risk Tolerance
            {
                "text": "How do you feel about taking professional risks?",
                "type": "multiple_choice",
                "category": "Risk Tolerance",
                "choices": [
                    {"text": "I avoid them. I prefer safe, predictable outcomes.", "archetype": "Guardian"},
                    {"text": "I take calculated risks after careful analysis.", "archetype": "Analyst"},
                    {"text": "I'm comfortable with risk if the potential reward is high.", "archetype": "Adventurer"},
                    {"text": "I thrive on risk and pushing boundaries.", "archetype": "Innovator"}
                ]
            },
            # Category: Big Picture vs. Detail-Oriented
            {
                "text": "When you look at a website, what do you notice first?",
                "type": "multiple_choice",
                "category": "Big Picture vs. Detail-Oriented",
                "choices": [
                    {"text": "The overall layout, colors, and feeling it evokes.", "archetype": "Designer"},
                    {"text": "The tiny details, like typos or a misaligned button.", "archetype": "Guardian"},
                    {"text": "How easy it is to find the information I need.", "archetype": "Analyst"},
                    {"text": "The technology it might be built with.", "archetype": "Maker"}
                ]
            },
            # More questions to round out the set
            {
                "text": "When a project is failing, what is your first reaction?",
                "type": "multiple_choice",
                "category": "Problem Solving",
                "choices": [
                    {"text": "Analyze the data to pinpoint the exact cause of failure.", "archetype": "Analyst"},
                    {"text": "Rally the team to boost morale and find a solution together.", "archetype": "Leader"},
                    {"text": "Pivot to a new, more promising direction.", "archetype": "Innovator"},
                    {"text": "Go back to the original plan and reinforce the process.", "archetype": "Guardian"}
                ]
            },
            {
                "text": "What's more important in a final product?",
                "type": "multiple_choice",
                "category": "Core Motivators",
                "choices": [
                    {"text": "That it's beautiful and a pleasure to use.", "archetype": "Designer"},
                    {"text": "That it's technically robust and performs flawlessly.", "archetype": "Maker"},
                    {"text": "That it solves the user's problem effectively.", "archetype": "Mentor"},
                    {"text": "That it's delivered on time and on budget.", "archetype": "Leader"}
                ]
            },
            {
                "text": "Which statement best describes you?",
                "type": "multiple_choice",
                "category": "Interpersonal Style",
                "choices": [
                    {"text": "I'm naturally curious and love to learn.", "archetype": "Investigator"},
                    {"text": "I'm a natural teacher and enjoy explaining things.", "archetype": "Mentor"},
                    {"text": "I'm very persuasive and can rally people to my cause.", "archetype": "Leader"},
                    {"text": "I'm empathetic and can easily understand others' feelings.", "archetype": "Connector"}
                ]
            },
            {
                "text": "You have a free afternoon to pursue a hobby. You choose to:",
                "type": "multiple_choice",
                "category": "Interests",
                "choices": [
                    {"text": "Tinker with electronics or code a small app.", "archetype": "Maker"},
                    {"text": "Read a non-fiction book on a topic that fascinates you.", "archetype": "Investigator"},
                    {"text": "Design a logo for a fictional company.", "archetype": "Designer"},
                    {"text": "Volunteer or spend time helping friends.", "archetype": "Mentor"}
                ]
            },
            {
                "text": "When it comes to deadlines, you are someone who...",
                "type": "multiple_choice",
                "category": "Work Style",
                "choices": [
                    {"text": "Finishes work well in advance to be safe.", "archetype": "Guardian"},
                    {"text": "Does their best work under pressure as the deadline nears.", "archetype": "Adventurer"},
                    {"text": "Sees deadlines as flexible guidelines.", "archetype": "Creator"},
                    {"text": "Uses deadlines to structure and motivate the team.", "archetype": "Leader"}
                ]
            },
            {
                "text": "Which founder do you admire more?",
                "type": "multiple_choice",
                "category": "Core Motivators",
                "choices": [
                    {"text": "Steve Jobs - for his relentless focus on product design and vision.", "archetype": "Designer"},
                    {"text": "Elon Musk - for his ambitious, world-changing technological bets.", "archetype": "Innovator"},
                    {"text": "Bill Gates - for his strategic business acumen and later philanthropy.", "archetype": "Leader"},
                    {"text": "Warren Buffett - for his patient, data-driven investment strategy.", "archetype": "Analyst"}
                ]
            }
        ]

        questions_data.extend(new_questions_data)
        
        for q_data in questions_data:
            question = Question(
                text=q_data["text"], 
                type=q_data["type"], 
                category=q_data["category"],
                assessment_id=new_assessment.id
            )
            session.add(question)
            await session.flush()
            for choice_data in q_data["choices"]:
                choice = Choice(
                    text=choice_data["text"], 
                    archetype=choice_data["archetype"], 
                    weight=1.0, 
                    question_id=question.id
                )
                session.add(choice)

        await session.commit()
        print("Successfully created the questionnaire!")

if __name__ == "__main__":
    asyncio.run(create_questionnaire())