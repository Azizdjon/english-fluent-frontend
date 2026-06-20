import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Mic, ClipboardCheck, Puzzle, BookOpen, MessageSquare, ClipboardList, User, TrendingUp, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <AppShell
      role="Student"
      navItems={[
        { to: "/student", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/lessons", label: "Lessons", icon: BookOpen },
        {
          to: "/student/grammar",
          label: "Grammar",
          icon: GraduationCap,
          children: [
            { to: "/student/grammar/simple-present-tense", label: "Simple Present Tense" },
            { to: "/student/grammar/present-continuous-tense", label: "Present Continuous Tense" },
            { to: "/student/grammar/present-tenses", label: "Present Tenses" },
            { to: "/student/grammar/simple-past-tense", label: "Simple Past Tense" },
            { to: "/student/grammar/past-continuous-tense", label: "Past Continuous Tense" },
            { to: "/student/grammar/past-continuous-tenses", label: "Past Continuous Tenses" },
            { to: "/student/grammar/past-tenses", label: "Past Tenses" },
            { to: "/student/grammar/simple-future-tense", label: "Simple Future Tense" },
            { to: "/student/grammar/future-tense", label: "Future Tense" },
            { to: "/student/grammar/future-continuous-tense", label: "Future Continuous Tense" },
            { to: "/student/grammar/future-perfect-tense", label: "Future Perfect Tense" },
            { to: "/student/grammar/future-in-past", label: "Future in Past" },
            { to: "/student/grammar/present-perfect-tense", label: "Present Perfect Tense" },
            { to: "/student/grammar/present-perfect-continuous", label: "Present Perfect Continuous Tense" },
            { to: "/student/grammar/present-perfect-continuous-2", label: "Present Perfect Continuous 2" },
            { to: "/student/grammar/past-perfect-tense", label: "Past Perfect Tense" },
            { to: "/student/grammar/past-perfect-continuous", label: "Past Perfect Continuous Tense" },
            { to: "/student/grammar/mixed-tenses", label: "Mixed Tenses" },
            { to: "/student/grammar/1st-conditional", label: "1st Conditional" },
            { to: "/student/grammar/2nd-conditional", label: "2nd Conditional" },
            { to: "/student/grammar/conditional", label: "Conditionals (3rd & Mixed)" },
            { to: "/student/grammar/personal-pronouns", label: "Personal Pronouns" },
            { to: "/student/grammar/possessive-pronouns", label: "Possessive Pronouns" },
            { to: "/student/grammar/possessive-adjectives", label: "Possessive Adjectives" },
            { to: "/student/grammar/reflective-pronouns", label: "Reflective Pronouns" },
            { to: "/student/grammar/relative-pronouns", label: "Relative Pronouns" },
            { to: "/student/grammar/reciprocal-pronouns", label: "Reciprocal Pronouns" },
            { to: "/student/grammar/objective-pronouns", label: "Objective Pronouns" },
            { to: "/student/grammar/pronouns", label: "Pronouns" },
            { to: "/student/grammar/articles", label: "Articles" },
            { to: "/student/grammar/prepositions", label: "Prepositions" },
            { to: "/student/grammar/modal-verbs", label: "Modal Verbs" },
            { to: "/student/grammar/gerund", label: "Gerund" },
            { to: "/student/grammar/phrasal-verbs", label: "Phrasal Verbs" },
            { to: "/student/grammar/causatives", label: "Causatives" },
            { to: "/student/grammar/indirect-speech", label: "Indirect Speech" },
            { to: "/student/grammar/reported-speech", label: "Reported Speech" },
            { to: "/student/grammar/passive-voice", label: "Passive Voice" },
            { to: "/student/grammar/infinitive-gerund", label: "Participle & Infinitive Gerund" },
            { to: "/student/grammar/adjectives", label: "Adjectives" },
            { to: "/student/grammar/adverbs", label: "Adverbs" },
            { to: "/student/grammar/comparative-adjectives", label: "Comparative Adjectives" },
            { to: "/student/grammar/superlative-adjectives", label: "Superlative Adjectives" },
            { to: "/student/grammar/conjunctions", label: "Conjunctions" },
            { to: "/student/grammar/question-tags", label: "Question Tags" },
            { to: "/student/grammar/additions-to-remarks", label: "Additions to Remarks" },
            { to: "/student/grammar/when-clause", label: "When Clause" },
            { to: "/student/grammar/while-clause", label: "While Clause" },
            { to: "/student/grammar/when-where-while", label: "When Where While Clauses" },
            { to: "/student/grammar/antonyms", label: "Antonyms" },
            { to: "/student/grammar/antonyms-2", label: "Antonyms (2)" },
            { to: "/student/grammar/proverbs", label: "Proverbs" },
            { to: "/student/grammar/logic-list", label: "Logic List of Words" },
            { to: "/student/grammar/logic-list-2", label: "Logic List of Words (2)" },
            { to: "/student/grammar/word-logically-out", label: "Word Logically Out of the Group" },
            { to: "/student/grammar/vocabulary-test-02", label: "Vocabulary Test 02" },
            { to: "/student/grammar/vocabulary-test-03", label: "Vocabulary Test 03" },
            { to: "/student/grammar/vocabulary-test-04", label: "Vocabulary Test 04" },
            { to: "/student/grammar/vocabulary-test-05", label: "Vocabulary Test 05" },
            { to: "/student/grammar/vocabulary-test-05ew", label: "Vocabulary Test 05 (ew)" },
            { to: "/student/grammar/vocabulary-test-06", label: "Vocabulary Test 06" },
            { to: "/student/grammar/vocabulary-test-07", label: "Vocabulary Test 07" },
            { to: "/student/grammar/vocabulary-test-08", label: "Vocabulary Test 08" },
            { to: "/student/grammar/vocabulary-test-09", label: "Vocabulary Test 09" },
            { to: "/student/grammar/vocabulary-test-10", label: "Vocabulary Test 10" },
            { to: "/student/grammar/there-is-there-are", label: "There is / There are" },
            { to: "/student/grammar/to-be-there-is-there-are", label: "To be & There is/There are" },
          ],
        },
        { to: "/student/progress", label: "Progress", icon: TrendingUp },
        { to: "/student/homework", label: "Homework", icon: ClipboardList },
        { to: "/student/speaking", label: "Speaking Lab", icon: Mic },
        { to: "/student/exercises", label: "Exercises", icon: Puzzle },
        { to: "/student/test", label: "Diagnostic Test", icon: ClipboardCheck },
        { to: "/student/pragmatic", label: "Pragmatic", icon: MessageSquare },
        { to: "/student/profile", label: "Profile", icon: User },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
