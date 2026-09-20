from typing import Dict, Any, List

class CompanyAgent:
    def get_company_prep(self, company_name: str) -> Dict[str, Any]:
        """Provides detailed company data including tech stack, culture, and coding questions."""
        company = company_name.lower()
        
        companies_data = {
            "amazon": {
                "name": "Amazon",
                "details": {
                    "hq": "Seattle, WA",
                    "founded": "1994",
                    "employees": "1.5M+",
                    "industry": "E-commerce, Cloud, AI",
                    "tech_stack": "Java, C++, Python, AWS (EC2, S3, DynamoDB), React",
                    "description": "Amazon is a global leader in e-commerce and cloud computing. Their culture is centered around 16 Leadership Principles."
                },
                "patterns": ["Leadership Principles (LP)", "System Design at Scale", "OOD", "Bar Raiser Rounds"],
                "questions": [
                    "Tell me about a time you disagreed with a manager (Disagree and Commit).",
                    "Design a scalable URL shortener.",
                    "How would you handle a conflict in a high-stakes project?",
                    "Design a Warehouse Management System."
                ],
                "coding_questions": [
                    {"title": "K Closest Points to Origin", "url": "https://leetcode.com/problems/k-closest-points-to-origin/"},
                    {"title": "LRU Cache", "url": "https://leetcode.com/problems/lru-cache/"},
                    {"title": "Number of Islands", "url": "https://leetcode.com/problems/number-of-islands/"}
                ],
                "tips": "Focus heavily on the STAR method and explicitly tie answers to their 16 LPs. Be ready for the 'Bar Raiser' round."
            },
            "google": {
                "name": "Google",
                "details": {
                    "hq": "Mountain View, CA",
                    "founded": "1998",
                    "employees": "180k+",
                    "industry": "Search, Ads, AI, Cloud",
                    "tech_stack": "C++, Java, Go, Python, TensorFlow, GCP",
                    "description": "Google focuses on organizing the world's information. They value 'Googliness' and technical excellence."
                },
                "patterns": ["Hard Data Structures", "Complex Algorithms", "System Design", "Googliness & Leadership"],
                "questions": [
                    "How would you invert a binary tree?",
                    "Design a distributed cache system.",
                    "Tell me about a technical challenge you solved.",
                    "How do you handle ambiguity in a project?"
                ],
                "coding_questions": [
                    {"title": "Median of Two Sorted Arrays", "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/"},
                    {"title": "Longest Substring Without Repeating Characters", "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
                    {"title": "Merge k Sorted Lists", "url": "https://leetcode.com/problems/merge-k-sorted-lists/"}
                ],
                "tips": "Expect very rigorous algorithmic rounds. They care more about optimal time complexity than working brute-force. Explain your thought process clearly."
            },
            "microsoft": {
                "name": "Microsoft",
                "details": {
                    "hq": "Redmond, WA",
                    "founded": "1975",
                    "employees": "220k+",
                    "industry": "Software, Cloud, Hardware",
                    "tech_stack": "C#, .NET, Azure, C++, TypeScript",
                    "description": "Microsoft empowers every person and every organization on the planet to achieve more. Strong focus on Azure and productivity."
                },
                "patterns": ["DSA Fundamentals", "System Design", "Behavioral (Growth Mindset)", "Product Thinking"],
                "questions": [
                    "Explain the difference between a class and an interface.",
                    "Design a collaborative document editor like Google Docs.",
                    "Tell me about a time you failed and what you learned.",
                    "How would you optimize a slow database query?"
                ],
                "coding_questions": [
                    {"title": "Valid Parentheses", "url": "https://leetcode.com/problems/valid-parentheses/"},
                    {"title": "String to Integer (atoi)", "url": "https://leetcode.com/problems/string-to-integer-atoi/"},
                    {"title": "Search in Rotated Sorted Array", "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/"}
                ],
                "tips": "Show a growth mindset. Microsoft values collaboration and learning from mistakes. Be prepared for deep dives into your projects."
            }
        }
        
        return companies_data.get(company, {
            "name": company_name,
            "details": {
                "hq": "N/A",
                "founded": "N/A",
                "employees": "N/A",
                "industry": "N/A",
                "tech_stack": "General stack",
                "description": f"{company_name} is a leading player in its field."
            },
            "patterns": ["General DSA", "Language Basics", "Behavioral"],
            "questions": [
                "Explain your previous projects.",
                "What are the 4 pillars of OOP?",
                "How do you stay updated with technology?"
            ],
            "coding_questions": [
                {"title": "Two Sum", "url": "https://leetcode.com/problems/two-sum/"},
                {"title": "Reverse String", "url": "https://leetcode.com/problems/reverse-string/"}
            ],
            "tips": "Focus on clear communication and solidifying your core concepts."
        })

class RoadmapAgent:
    def generate_roadmap(self, role: str, duration_weeks: int) -> Dict[str, Any]:
        """Generates a structured, detailed study plan with daily tasks."""
        role_key = role.lower()
        plan = []
        
        # Example for SDE (Logic for other roles can be added similarly)
        if "sde" in role_key or "software" in role_key:
            for week_num in range(1, duration_weeks + 1):
                week_data = {"week": week_num, "focus": "", "tasks": []}
                if week_num == 1:
                    week_data["focus"] = "Data Structures Foundations"
                    week_data["tasks"] = [
                        {"day": "Day 1-2", "title": "Arrays & Strings", "desc": "Master basic operations, two-pointer techniques, and sliding window.", "milestone": "Solve 10 Easy Array problems"},
                        {"day": "Day 3-4", "title": "Linked Lists", "desc": "Implement singly/doubly linked lists and solve cycle detection problems.", "milestone": "Implement a Linked List from scratch"},
                        {"day": "Day 5-6", "title": "Stacks & Queues", "desc": "Understand LIFO/FIFO and solve monotonic stack problems.", "milestone": "Solve 'Valid Parentheses'"}
                    ]
                elif week_num == 2:
                    week_data["focus"] = "Advanced Algorithms"
                    week_data["tasks"] = [
                        {"day": "Day 1-2", "title": "Trees & Graphs", "desc": "BFS, DFS, and tree traversals. Understand recursion deeply.", "milestone": "Solve 5 Medium Tree problems"},
                        {"day": "Day 3-4", "title": "Dynamic Programming", "desc": "Master memoization and tabulation for optimization.", "milestone": "Solve 'Climbing Stairs' and 'Coin Change'"},
                        {"day": "Day 5-6", "title": "Sorting & Searching", "desc": "QuickSort, MergeSort, and Binary Search variants.", "milestone": "Implement Binary Search without bugs"}
                    ]
                elif week_num == 3:
                    week_data["focus"] = "System Design & HLD"
                    week_data["tasks"] = [
                        {"day": "Day 1-2", "title": "Scalability Basics", "desc": "Load balancers, caching, and database sharding.", "milestone": "Write a summary of HLD principles"},
                        {"day": "Day 3-4", "title": "API Design", "desc": "RESTful principles and designing robust API schemas.", "milestone": "Design a small URL shortener API"},
                        {"day": "Day 5-6", "title": "Database Indexing", "desc": "B-Trees, Hash indexes, and performance tuning.", "milestone": "Analyze a slow query execution plan"}
                    ]
                else:
                    week_data["focus"] = "Mock Interviews & Soft Skills"
                    week_data["tasks"] = [
                        {"day": "Day 1-2", "title": "Behavioral Prep", "desc": "Prepare STAR stories for Amazon LPs and general values.", "milestone": "Write 5 STAR stories"},
                        {"day": "Day 3-4", "title": "Mock Interviews", "desc": "Use the Mock Interview module for live role-play.", "milestone": "Complete 3 full mock sessions"},
                        {"day": "Day 5-6", "title": "Resume Finalization", "desc": "Polish your resume based on ATS feedback.", "milestone": "Achieve >80 ATS score"}
                    ]
                plan.append(week_data)
        else:
            # Fallback for other roles
            for week_num in range(1, duration_weeks + 1):
                plan.append({
                    "week": week_num,
                    "focus": f"General {role} Preparation",
                    "tasks": [
                        {"day": "Week Beginning", "title": "Core Concepts", "desc": f"Review fundamental concepts relevant to {role}.", "milestone": "Master basics"},
                        {"day": "Mid Week", "title": "Practical Application", "desc": "Work on a project or case study.", "milestone": "Finish small project"},
                        {"day": "Week End", "title": "Review & Mock", "desc": "Test your knowledge with mock questions.", "milestone": "Pass self-assessment"}
                    ]
                })

        return {"role": role, "duration": duration_weeks, "plan": plan}

company_agent = CompanyAgent()
roadmap_agent = RoadmapAgent()
