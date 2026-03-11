import { slugify, type TarotCard, type TarotSuit } from "@/lib/tarot";

type MinorSuit = Exclude<TarotSuit, "Major Arcana">;

type CardDefinition = {
  name: string;
  number: string;
  uprightMeaning: string;
  reversedMeaning: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  reflection: string;
  symbols: string[];
  palette?: TarotCard["palette"];
};

const suitPalettes: Record<MinorSuit, TarotCard["palette"]> = {
  Cups: { glow: "#99f6e4", accent: "#0f766e", ink: "#f0fdfa" },
  Pentacles: { glow: "#bbf7d0", accent: "#15803d", ink: "#f0fdf4" },
  Swords: { glow: "#dbeafe", accent: "#1d4ed8", ink: "#eff6ff" },
  Wands: { glow: "#fdba74", accent: "#ea580c", ink: "#fff7ed" }
};

const defaultMajorPalette: TarotCard["palette"] = {
  glow: "#f5d0fe",
  accent: "#a21caf",
  ink: "#fdf4ff"
};

function createMajorCard(definition: CardDefinition): TarotCard {
  return {
    slug: slugify(definition.name),
    name: definition.name,
    arcana: "Major Arcana",
    suit: "Major Arcana",
    number: definition.number,
    uprightMeaning: definition.uprightMeaning,
    reversedMeaning: definition.reversedMeaning,
    uprightKeywords: definition.uprightKeywords,
    reversedKeywords: definition.reversedKeywords,
    reflection: definition.reflection,
    palette: definition.palette ?? defaultMajorPalette,
    symbols: definition.symbols
  };
}

function createMinorCard(suit: MinorSuit, definition: CardDefinition): TarotCard {
  return {
    slug: slugify(definition.name),
    name: definition.name,
    arcana: suit,
    suit,
    number: definition.number,
    uprightMeaning: definition.uprightMeaning,
    reversedMeaning: definition.reversedMeaning,
    uprightKeywords: definition.uprightKeywords,
    reversedKeywords: definition.reversedKeywords,
    reflection: definition.reflection,
    palette: definition.palette ?? suitPalettes[suit],
    symbols: definition.symbols
  };
}

const majorArcana: CardDefinition[] = [
  {
    name: "The Fool",
    number: "0",
    uprightMeaning: "A fresh leap, brave innocence, and the courage to begin without guarantees.",
    reversedMeaning: "Naivete, scattered choices, or a leap made without grounding.",
    uprightKeywords: ["Beginnings", "Freedom", "Trust", "Adventure"],
    reversedKeywords: ["Recklessness", "Distraction", "Avoidance", "Poor timing"],
    reflection: "What wants to begin if you stop demanding certainty first?",
    symbols: ["Feather", "Sunrise", "Cliff"],
    palette: { glow: "#f7caa1", accent: "#f97316", ink: "#fff7ed" }
  },
  {
    name: "The Magician",
    number: "I",
    uprightMeaning: "Skill, intention, and the ability to channel vision into form through focused action.",
    reversedMeaning: "Misaligned ambition, half-used gifts, or performance that hides a lack of substance.",
    uprightKeywords: ["Manifestation", "Focus", "Skill", "Initiative"],
    reversedKeywords: ["Manipulation", "Untapped talent", "Misdirection", "Fragmented effort"],
    reflection: "Which tool in your life is ready to be used with full intention?",
    symbols: ["Wand", "Infinity", "Rose"],
    palette: { glow: "#c4b5fd", accent: "#8b5cf6", ink: "#f5f3ff" }
  },
  {
    name: "The High Priestess",
    number: "II",
    uprightMeaning: "Inner knowing, mystery, and truths that arrive through quiet attention rather than force.",
    reversedMeaning: "Ignoring intuition, cloudy signals, or oversharing what needs privacy to ripen.",
    uprightKeywords: ["Intuition", "Mystery", "Stillness", "Inner truth"],
    reversedKeywords: ["Blocked intuition", "Secrets", "Confusion", "Disconnection"],
    reflection: "What have you known quietly for a while now?",
    symbols: ["Moon", "Veil", "Pomegranate"],
    palette: { glow: "#93c5fd", accent: "#2563eb", ink: "#eff6ff" }
  },
  {
    name: "The Empress",
    number: "III",
    uprightMeaning: "Abundance, beauty, and creative life taking root where care is consistent and embodied.",
    reversedMeaning: "Depletion, creative block, or giving so much that your own ground goes dry.",
    uprightKeywords: ["Nurturing", "Abundance", "Creativity", "Sensuality"],
    reversedKeywords: ["Smothering", "Burnout", "Dependence", "Creative drought"],
    reflection: "Where do you need more nourishment than pressure?",
    symbols: ["Venus", "Wheat", "Crown"],
    palette: { glow: "#f9a8d4", accent: "#db2777", ink: "#fdf2f8" }
  },
  {
    name: "The Emperor",
    number: "IV",
    uprightMeaning: "Authority, structure, and the steady discipline that turns order into protection.",
    reversedMeaning: "Rigidity, control issues, or power used to dominate instead of stabilize.",
    uprightKeywords: ["Structure", "Leadership", "Protection", "Discipline"],
    reversedKeywords: ["Control", "Stubbornness", "Harshness", "Instability"],
    reflection: "What part of your life needs clearer structure without becoming a cage?",
    symbols: ["Throne", "Ram", "Stone"],
    palette: { glow: "#fdba74", accent: "#c2410c", ink: "#fff7ed" }
  },
  {
    name: "The Hierophant",
    number: "V",
    uprightMeaning: "Tradition, shared wisdom, and learning through established practice, teaching, or ritual.",
    reversedMeaning: "Empty conformity, rebellion for its own sake, or beliefs that no longer fit the truth.",
    uprightKeywords: ["Tradition", "Teaching", "Commitment", "Ritual"],
    reversedKeywords: ["Dogma", "Rebellion", "Outdated rules", "Blind obedience"],
    reflection: "Which traditions support you, and which ones are only inherited noise?",
    symbols: ["Keys", "Pillars", "Crown"],
    palette: { glow: "#e9d5ff", accent: "#7e22ce", ink: "#faf5ff" }
  },
  {
    name: "The Lovers",
    number: "VI",
    uprightMeaning: "Alignment, intimacy, and a choice that asks for honesty between desire and values.",
    reversedMeaning: "Misalignment, mixed signals, or choosing comfort over real congruence.",
    uprightKeywords: ["Union", "Alignment", "Choice", "Intimacy"],
    reversedKeywords: ["Disharmony", "Temptation", "Miscommunication", "Value conflict"],
    reflection: "What choice becomes clear when you ask what truly aligns, not what merely attracts?",
    symbols: ["Angel", "Mountain", "Apple"],
    palette: { glow: "#fbcfe8", accent: "#e11d48", ink: "#fff1f2" }
  },
  {
    name: "The Chariot",
    number: "VII",
    uprightMeaning: "Momentum, willpower, and progress earned by steering opposing forces toward one aim.",
    reversedMeaning: "Loss of control, scattered drive, or trying to force movement without direction.",
    uprightKeywords: ["Drive", "Victory", "Direction", "Discipline"],
    reversedKeywords: ["Stalling", "Aggression", "Lack of focus", "Resistance"],
    reflection: "Where would disciplined movement serve you better than raw force?",
    symbols: ["Chariot", "Stars", "Sphinx"],
    palette: { glow: "#bfdbfe", accent: "#1d4ed8", ink: "#eff6ff" }
  },
  {
    name: "Strength",
    number: "VIII",
    uprightMeaning: "Courage, patience, and the power that comes from calm relationship with instinct.",
    reversedMeaning: "Self-doubt, reactive behavior, or trying to overpower what needs compassion.",
    uprightKeywords: ["Courage", "Patience", "Compassion", "Inner strength"],
    reversedKeywords: ["Insecurity", "Volatility", "Exhaustion", "Force"],
    reflection: "What soft, steady strength is more useful than trying to overpower the moment?",
    symbols: ["Lion", "Infinity", "Garland"],
    palette: { glow: "#fde68a", accent: "#ca8a04", ink: "#fffbeb" }
  },
  {
    name: "The Hermit",
    number: "IX",
    uprightMeaning: "Retreat, contemplation, and wisdom earned through honest solitude.",
    reversedMeaning: "Isolation, avoidance, or refusing the lesson that stillness is trying to offer.",
    uprightKeywords: ["Solitude", "Wisdom", "Search", "Guidance"],
    reversedKeywords: ["Withdrawal", "Loneliness", "Avoidance", "Stagnation"],
    reflection: "What becomes obvious when the noise drops away?",
    symbols: ["Lantern", "Mountain", "Staff"],
    palette: { glow: "#d4d4d8", accent: "#71717a", ink: "#fafafa" }
  },
  {
    name: "Wheel of Fortune",
    number: "X",
    uprightMeaning: "Timing, momentum, and a turn in the cycle that changes the atmosphere around you.",
    reversedMeaning: "Resistance to change, delays, or a pattern repeating because the lesson is not integrated.",
    uprightKeywords: ["Cycles", "Luck", "Change", "Timing"],
    reversedKeywords: ["Setbacks", "Resistance", "Repetition", "Bad timing"],
    reflection: "What cycle is turning whether you cling or not?",
    symbols: ["Wheel", "Clouds", "Sphinx"],
    palette: { glow: "#fde68a", accent: "#d97706", ink: "#fffbeb" }
  },
  {
    name: "Justice",
    number: "XI",
    uprightMeaning: "Clarity, accountability, and choices that must align with truth instead of convenience.",
    reversedMeaning: "Bias, denial, or consequences arriving because balance has been ignored.",
    uprightKeywords: ["Truth", "Fairness", "Accountability", "Balance"],
    reversedKeywords: ["Dishonesty", "Bias", "Evasion", "Imbalance"],
    reflection: "What would honesty require if you stopped negotiating with it?",
    symbols: ["Scale", "Sword", "Pillar"],
    palette: { glow: "#fecaca", accent: "#dc2626", ink: "#fef2f2" }
  },
  {
    name: "The Hanged Man",
    number: "XII",
    uprightMeaning: "Suspension, surrender, and insight that appears when control is released long enough to see differently.",
    reversedMeaning: "Needless delay, martyrdom, or refusing the shift in perspective the moment demands.",
    uprightKeywords: ["Pause", "Surrender", "Perspective", "Release"],
    reversedKeywords: ["Stalling", "Resistance", "Martyrdom", "Limbo"],
    reflection: "What changes if you stop trying to move forward and instead see sideways?",
    symbols: ["Halo", "Tree", "Rope"],
    palette: { glow: "#bfdbfe", accent: "#2563eb", ink: "#eff6ff" }
  },
  {
    name: "Death",
    number: "XIII",
    uprightMeaning: "Transformation, endings, and the clearing that makes real renewal possible.",
    reversedMeaning: "Clinging, fear of change, or stretching out what is already complete.",
    uprightKeywords: ["Ending", "Release", "Transformation", "Transition"],
    reversedKeywords: ["Resistance", "Stagnation", "Fear", "Lingering"],
    reflection: "What are you carrying past its rightful ending?",
    symbols: ["Rose", "Flag", "River"],
    palette: { glow: "#cbd5e1", accent: "#334155", ink: "#f8fafc" }
  },
  {
    name: "Temperance",
    number: "XIV",
    uprightMeaning: "Harmony, moderation, and skillful blending that creates something steadier than extremes.",
    reversedMeaning: "Excess, impatience, or parts of life pulling apart because balance is neglected.",
    uprightKeywords: ["Moderation", "Healing", "Integration", "Flow"],
    reversedKeywords: ["Excess", "Imbalance", "Impatience", "Disorder"],
    reflection: "What would the middle path look like if it were an act of mastery rather than compromise?",
    symbols: ["Angel", "Cup", "Stream"],
    palette: { glow: "#a7f3d0", accent: "#059669", ink: "#ecfdf5" }
  },
  {
    name: "The Devil",
    number: "XV",
    uprightMeaning: "Attachment, temptation, and the places where desire becomes a chain instead of a choice.",
    reversedMeaning: "Liberation, shadow work, or finally seeing where the bind is looser than it seemed.",
    uprightKeywords: ["Attachment", "Temptation", "Shadow", "Entrapment"],
    reversedKeywords: ["Release", "Awareness", "Detachment", "Recovery"],
    reflection: "Which habit keeps promising power while quietly taking it away?",
    symbols: ["Chains", "Torch", "Goat"],
    palette: { glow: "#a78bfa", accent: "#6d28d9", ink: "#f5f3ff" }
  },
  {
    name: "The Tower",
    number: "XVI",
    uprightMeaning: "Shock, upheaval, and truth breaking through structures that could not hold.",
    reversedMeaning: "Avoided collapse, internal crisis, or change delayed until it becomes harder.",
    uprightKeywords: ["Upheaval", "Revelation", "Breakthrough", "Disruption"],
    reversedKeywords: ["Avoidance", "Delayed change", "Internal collapse", "Fear"],
    reflection: "What unstable structure are you still defending out of familiarity?",
    symbols: ["Lightning", "Crown", "Flame"],
    palette: { glow: "#fca5a5", accent: "#dc2626", ink: "#fff1f2" }
  },
  {
    name: "The Star",
    number: "XVII",
    uprightMeaning: "Hope, spiritual replenishment, and guidance returning after a hard stretch.",
    reversedMeaning: "Dimmed faith, creative drought, or forgetting that healing is already in motion.",
    uprightKeywords: ["Hope", "Healing", "Guidance", "Renewal"],
    reversedKeywords: ["Discouragement", "Doubt", "Disconnection", "Fatigue"],
    reflection: "What restores your sense of direction when you feel off course?",
    symbols: ["Stars", "Water", "Horizon"],
    palette: { glow: "#7dd3fc", accent: "#0ea5e9", ink: "#ecfeff" }
  },
  {
    name: "The Moon",
    number: "XVIII",
    uprightMeaning: "Dreams, ambiguity, and intuition moving through shadow before certainty arrives.",
    reversedMeaning: "Confusion clearing, illusion breaking, or fear losing its influence.",
    uprightKeywords: ["Intuition", "Dreams", "Mystery", "Uncertainty"],
    reversedKeywords: ["Clarity", "Exposure", "Released fear", "Truth emerging"],
    reflection: "What feeling asks to be interpreted instead of feared?",
    symbols: ["Moon", "Path", "Tide"],
    palette: { glow: "#a5b4fc", accent: "#4f46e5", ink: "#eef2ff" }
  },
  {
    name: "The Sun",
    number: "XIX",
    uprightMeaning: "Joy, visibility, and life force moving openly with warmth, honesty, and momentum.",
    reversedMeaning: "Temporary clouds, delayed joy, or success muted by overthinking or self-consciousness.",
    uprightKeywords: ["Joy", "Vitality", "Confidence", "Success"],
    reversedKeywords: ["Doubt", "Delay", "Burnout", "Muted optimism"],
    reflection: "Where would simple openness do more for you than guarded sophistication?",
    symbols: ["Sun", "Child", "Sunflower"],
    palette: { glow: "#fde68a", accent: "#f59e0b", ink: "#fffbeb" }
  },
  {
    name: "Judgement",
    number: "XX",
    uprightMeaning: "Awakening, reckoning, and the call to live from what you now know.",
    reversedMeaning: "Self-judgment, avoidance of the call, or a needed reckoning postponed.",
    uprightKeywords: ["Awakening", "Calling", "Reckoning", "Renewal"],
    reversedKeywords: ["Avoidance", "Self-doubt", "Stuck past", "Indecision"],
    reflection: "What invitation keeps returning because it is not finished with you?",
    symbols: ["Trumpet", "Angel", "Rising"],
    palette: { glow: "#bae6fd", accent: "#0284c7", ink: "#f0f9ff" }
  },
  {
    name: "The World",
    number: "XXI",
    uprightMeaning: "Completion, integration, and the grounded satisfaction of a cycle fully realized.",
    reversedMeaning: "Loose ends, partial closure, or holding back at the threshold of completion.",
    uprightKeywords: ["Completion", "Wholeness", "Mastery", "Closure"],
    reversedKeywords: ["Unfinished work", "Delay", "Fragmentation", "Holding back"],
    reflection: "What would it take to let this chapter be complete?",
    symbols: ["Wreath", "Dancer", "Laurel"],
    palette: { glow: "#86efac", accent: "#16a34a", ink: "#f0fdf4" }
  }
];

const cups: CardDefinition[] = [
  {
    name: "Ace of Cups",
    number: "Ace",
    uprightMeaning: "Emotional renewal, tenderness, and an open channel for connection, intuition, or love.",
    reversedMeaning: "Emotional overflow, guardedness, or feelings that need gentler pacing and clearer boundaries.",
    uprightKeywords: ["Love", "Compassion", "Intuition", "New feelings"],
    reversedKeywords: ["Overflow", "Guarded heart", "Emotional block", "Self-protection"],
    reflection: "Where could you allow more feeling without losing your center?",
    symbols: ["Chalice", "Waterfall", "Lotus"]
  },
  {
    name: "Two of Cups",
    number: "Two",
    uprightMeaning: "Mutuality, chemistry, and trust built through reciprocal presence and honest exchange.",
    reversedMeaning: "Misread signals, imbalance, or a bond that needs repair before it can deepen.",
    uprightKeywords: ["Partnership", "Union", "Reciprocity", "Affection"],
    reversedKeywords: ["Disharmony", "Distance", "Mismatch", "Repair"],
    reflection: "Where are you being asked to meet someone halfway?",
    symbols: ["Twin Cups", "Caduceus", "Lion"]
  },
  {
    name: "Three of Cups",
    number: "Three",
    uprightMeaning: "Celebration, friendship, and emotional support strengthened through shared joy.",
    reversedMeaning: "Social overload, gossip, or connection that turns shallow when it loses sincerity.",
    uprightKeywords: ["Celebration", "Friendship", "Community", "Joy"],
    reversedKeywords: ["Gossip", "Excess", "Third-party tension", "Isolation"],
    reflection: "Who helps you remember joy is also part of healing?",
    symbols: ["Garland", "Dancers", "Fruit"]
  },
  {
    name: "Four of Cups",
    number: "Four",
    uprightMeaning: "Withdrawal, contemplation, and the need to notice what is being offered beyond your current mood.",
    reversedMeaning: "Re-engagement, emotional awakening, or a chance finally being seen for what it is.",
    uprightKeywords: ["Apathy", "Reflection", "Rest", "Missed offer"],
    reversedKeywords: ["Renewed interest", "Awareness", "Acceptance", "Re-entry"],
    reflection: "What quiet opportunity have you overlooked because it did not arrive dramatically?",
    symbols: ["Cup", "Cloud", "Tree"]
  },
  {
    name: "Five of Cups",
    number: "Five",
    uprightMeaning: "Grief, disappointment, and the ache of focusing on what has spilled.",
    reversedMeaning: "Acceptance, forgiveness, and the first turn toward what still remains.",
    uprightKeywords: ["Loss", "Regret", "Grief", "Disappointment"],
    reversedKeywords: ["Healing", "Acceptance", "Recovery", "Perspective"],
    reflection: "What still stands behind you, even after loss?",
    symbols: ["Spilled Cups", "Bridge", "River"]
  },
  {
    name: "Six of Cups",
    number: "Six",
    uprightMeaning: "Nostalgia, innocence, and generous connection informed by the heart's memory.",
    reversedMeaning: "Living in the past, idealizing history, or needing to grow beyond an old pattern.",
    uprightKeywords: ["Nostalgia", "Kindness", "Memory", "Childhood"],
    reversedKeywords: ["Stuck past", "Naivete", "Idealization", "Maturity"],
    reflection: "What from the past is worth carrying forward, and what belongs there?",
    symbols: ["Flowers", "Courtyard", "Children"]
  },
  {
    name: "Seven of Cups",
    number: "Seven",
    uprightMeaning: "Many options, imagination, and the risk of mistaking fantasy for a real path.",
    reversedMeaning: "Discernment, narrowed focus, or illusions losing their spell as priorities sharpen.",
    uprightKeywords: ["Choices", "Fantasy", "Temptation", "Vision"],
    reversedKeywords: ["Clarity", "Focus", "Reality check", "Commitment"],
    reflection: "Which option remains meaningful after the glamour fades?",
    symbols: ["Clouds", "Jewels", "Snake"]
  },
  {
    name: "Eight of Cups",
    number: "Eight",
    uprightMeaning: "Walking away, emotional maturity, and leaving what is no longer alive enough to sustain you.",
    reversedMeaning: "Fear of leaving, drifting back, or staying because uncertainty feels harder than dissatisfaction.",
    uprightKeywords: ["Departure", "Search", "Release", "Maturity"],
    reversedKeywords: ["Avoidance", "Return", "Stagnation", "Fear of change"],
    reflection: "What are you ready to leave, even without a perfect map forward?",
    symbols: ["Moon", "Path", "Stacked Cups"]
  },
  {
    name: "Nine of Cups",
    number: "Nine",
    uprightMeaning: "Satisfaction, gratitude, and a moment of emotional fulfillment or earned pleasure.",
    reversedMeaning: "Hollow gratification, indulgence, or getting what you wanted without the deeper nourishment you hoped for.",
    uprightKeywords: ["Contentment", "Pleasure", "Wish fulfilled", "Gratitude"],
    reversedKeywords: ["Overindulgence", "Emptiness", "Smugness", "Disappointment"],
    reflection: "What kind of satisfaction actually leaves you fuller, not just pleased?",
    symbols: ["Bench", "Cups", "Folded Arms"]
  },
  {
    name: "Ten of Cups",
    number: "Ten",
    uprightMeaning: "Emotional harmony, belonging, and joy that is strengthened by shared trust.",
    reversedMeaning: "Domestic tension, broken harmony, or ideals of happiness not matching lived reality.",
    uprightKeywords: ["Harmony", "Family", "Belonging", "Joy"],
    reversedKeywords: ["Disconnection", "Conflict", "Misaligned ideals", "Tension"],
    reflection: "What helps a sense of home become real rather than symbolic?",
    symbols: ["Rainbow", "Home", "Raised Arms"]
  },
  {
    name: "Page of Cups",
    number: "Page",
    uprightMeaning: "Tender messages, creative sensitivity, and an invitation to respond with curiosity instead of cynicism.",
    reversedMeaning: "Emotional immaturity, avoidance, or inspiration that stays undeveloped because it is not trusted.",
    uprightKeywords: ["Curiosity", "Message", "Sensitivity", "Creativity"],
    reversedKeywords: ["Immaturity", "Moodiness", "Blocked expression", "Avoidance"],
    reflection: "What would it look like to treat your softer impulses as useful information?",
    symbols: ["Fish", "Cup", "Wave"]
  },
  {
    name: "Knight of Cups",
    number: "Knight",
    uprightMeaning: "Romance, idealism, and movement guided by feeling, beauty, or sincere invitation.",
    reversedMeaning: "Mood-led decisions, mixed intentions, or promises stronger in tone than in follow-through.",
    uprightKeywords: ["Romance", "Charm", "Invitation", "Idealism"],
    reversedKeywords: ["Mood swings", "Illusion", "Inconsistency", "Escapism"],
    reflection: "Where is your heart offering direction, and where is it simply chasing atmosphere?",
    symbols: ["Horse", "Winged Helmet", "Cup"]
  },
  {
    name: "Queen of Cups",
    number: "Queen",
    uprightMeaning: "Compassion, emotional intelligence, and deep sensitivity held with healthy boundaries.",
    reversedMeaning: "Moodiness, over-identification, or empathy that drains instead of heals.",
    uprightKeywords: ["Empathy", "Intuition", "Care", "Emotional wisdom"],
    reversedKeywords: ["Overwhelm", "Codependence", "Moodiness", "Blurred boundaries"],
    reflection: "How can you stay receptive without absorbing everything?",
    symbols: ["Throne", "Sea", "Shell"]
  },
  {
    name: "King of Cups",
    number: "King",
    uprightMeaning: "Emotional steadiness, wise diplomacy, and mature feeling expressed without drama.",
    reversedMeaning: "Emotional suppression, manipulation, or composure used to avoid real vulnerability.",
    uprightKeywords: ["Balance", "Diplomacy", "Wisdom", "Composure"],
    reversedKeywords: ["Control", "Detachment", "Manipulation", "Suppressed emotion"],
    reflection: "What would emotional maturity look like in this situation, not just emotional control?",
    symbols: ["Throne", "Ship", "Cup"]
  }
];

const pentacles: CardDefinition[] = [
  {
    name: "Ace of Pentacles",
    number: "Ace",
    uprightMeaning: "A grounded new start, material support, or a seed worth tending patiently.",
    reversedMeaning: "Missed opportunity, poor roots, or chasing a promise without practical follow-through.",
    uprightKeywords: ["Opportunity", "Stability", "Seed", "Prosperity"],
    reversedKeywords: ["Delay", "Missed chance", "Instability", "Poor planning"],
    reflection: "What new beginning needs structure as much as passion?",
    symbols: ["Coin", "Garden", "Archway"]
  },
  {
    name: "Two of Pentacles",
    number: "Two",
    uprightMeaning: "Adaptation, juggling, and keeping several moving parts in play with flexibility.",
    reversedMeaning: "Overcommitment, imbalance, or practical stress caused by trying to hold too much at once.",
    uprightKeywords: ["Balance", "Adaptability", "Rhythm", "Management"],
    reversedKeywords: ["Overload", "Disorganization", "Stress", "Instability"],
    reflection: "Which responsibility needs a cleaner rhythm instead of more effort?",
    symbols: ["Infinity Loop", "Coins", "Waves"]
  },
  {
    name: "Three of Pentacles",
    number: "Three",
    uprightMeaning: "Collaboration, craftsmanship, and skill developing through shared effort and feedback.",
    reversedMeaning: "Poor teamwork, uneven standards, or talent wasted by weak coordination.",
    uprightKeywords: ["Teamwork", "Skill", "Craft", "Recognition"],
    reversedKeywords: ["Misalignment", "Low quality", "Isolation", "Frustration"],
    reflection: "Where would better collaboration produce a stronger result than going alone?",
    symbols: ["Arch", "Tools", "Pentacles"]
  },
  {
    name: "Four of Pentacles",
    number: "Four",
    uprightMeaning: "Security, conservation, and holding tightly to resources, identity, or control.",
    reversedMeaning: "Release, generosity, or instability created by grasping or fear-based spending.",
    uprightKeywords: ["Security", "Control", "Savings", "Boundaries"],
    reversedKeywords: ["Greed", "Fear", "Release", "Instability"],
    reflection: "What are you protecting, and has protection started turning into constriction?",
    symbols: ["Crown", "Coins", "Stone Seat"]
  },
  {
    name: "Five of Pentacles",
    number: "Five",
    uprightMeaning: "Hardship, scarcity, and the emotional weight of feeling outside warmth or support.",
    reversedMeaning: "Recovery, help arriving, or the first visible exit from a season of lack.",
    uprightKeywords: ["Scarcity", "Hardship", "Exclusion", "Need"],
    reversedKeywords: ["Recovery", "Support", "Hope", "Improvement"],
    reflection: "Where might support already exist if pride or fear were set aside?",
    symbols: ["Snow", "Window", "Crutch"]
  },
  {
    name: "Six of Pentacles",
    number: "Six",
    uprightMeaning: "Generosity, exchange, and resources moving where they are needed with fairness.",
    reversedMeaning: "Strings attached, unequal exchange, or help offered from imbalance rather than care.",
    uprightKeywords: ["Generosity", "Support", "Fairness", "Exchange"],
    reversedKeywords: ["Debt", "Power imbalance", "Strings attached", "Resentment"],
    reflection: "Where does fairness matter more than appearance?",
    symbols: ["Scales", "Coins", "Hands"]
  },
  {
    name: "Seven of Pentacles",
    number: "Seven",
    uprightMeaning: "Assessment, patience, and long-term effort that needs time before it shows full results.",
    reversedMeaning: "Impatience, poor return, or frustration with a process that needs adjustment or release.",
    uprightKeywords: ["Patience", "Assessment", "Investment", "Growth"],
    reversedKeywords: ["Frustration", "Delay", "Poor return", "Reevaluation"],
    reflection: "What deserves more patience, and what no longer deserves your labor?",
    symbols: ["Vine", "Coins", "Pause"]
  },
  {
    name: "Eight of Pentacles",
    number: "Eight",
    uprightMeaning: "Apprenticeship, repetition, and focused work that steadily sharpens mastery.",
    reversedMeaning: "Monotony, perfectionism, or cutting corners that weaken the craft over time.",
    uprightKeywords: ["Practice", "Craftsmanship", "Focus", "Mastery"],
    reversedKeywords: ["Perfectionism", "Burnout", "Sloppiness", "Drudgery"],
    reflection: "What skill would change your life if you practiced it consistently instead of dramatically?",
    symbols: ["Hammer", "Bench", "Coins"]
  },
  {
    name: "Nine of Pentacles",
    number: "Nine",
    uprightMeaning: "Self-sufficiency, refinement, and the pleasure of enjoying what you have built.",
    reversedMeaning: "Dependence, overinvestment in image, or comfort that costs too much freedom.",
    uprightKeywords: ["Independence", "Luxury", "Confidence", "Reward"],
    reversedKeywords: ["Dependence", "Overconsumption", "Isolation", "Pretense"],
    reflection: "What does enough look like when it is measured by freedom rather than display?",
    symbols: ["Falcon", "Garden", "Vine"]
  },
  {
    name: "Ten of Pentacles",
    number: "Ten",
    uprightMeaning: "Legacy, stability, and wealth or wisdom rooted in continuity across time.",
    reversedMeaning: "Family strain, fragile foundations, or material focus that weakens deeper belonging.",
    uprightKeywords: ["Legacy", "Security", "Inheritance", "Long-term success"],
    reversedKeywords: ["Instability", "Conflict", "Loss", "Short-term thinking"],
    reflection: "What are you building that could outlast your immediate mood or season?",
    symbols: ["Archway", "Dogs", "Coins"]
  },
  {
    name: "Page of Pentacles",
    number: "Page",
    uprightMeaning: "Study, practical curiosity, and the early stage of building something real.",
    reversedMeaning: "Procrastination, weak follow-through, or good ideas not grounded in action.",
    uprightKeywords: ["Study", "Opportunity", "Diligence", "Planning"],
    reversedKeywords: ["Laziness", "Delay", "Distraction", "Unfocused ambition"],
    reflection: "What would happen if you treated this possibility like a craft to be learned?",
    symbols: ["Coin", "Field", "Book"]
  },
  {
    name: "Knight of Pentacles",
    number: "Knight",
    uprightMeaning: "Reliability, discipline, and progress made through consistency more than speed.",
    reversedMeaning: "Stagnation, rigidity, or becoming so routine-bound that life loses responsiveness.",
    uprightKeywords: ["Consistency", "Duty", "Reliability", "Persistence"],
    reversedKeywords: ["Stagnation", "Boredom", "Rigidity", "Resistance"],
    reflection: "Where does steady effort beat brilliance right now?",
    symbols: ["Horse", "Coin", "Field"]
  },
  {
    name: "Queen of Pentacles",
    number: "Queen",
    uprightMeaning: "Steady care, resourcefulness, and prosperity shaped through grounded devotion.",
    reversedMeaning: "Overwork, possessiveness, or caretaking that forgets the self entirely.",
    uprightKeywords: ["Nurturing", "Practicality", "Comfort", "Resourcefulness"],
    reversedKeywords: ["Overwork", "Materialism", "Possessiveness", "Neglect of self"],
    reflection: "What would a more grounded version of care look like today?",
    symbols: ["Rabbit", "Garden Wall", "Pentacle"]
  },
  {
    name: "King of Pentacles",
    number: "King",
    uprightMeaning: "Material mastery, stewardship, and a calm ability to sustain abundance responsibly.",
    reversedMeaning: "Greed, stubbornness, or using resources to control rather than support.",
    uprightKeywords: ["Stewardship", "Security", "Abundance", "Leadership"],
    reversedKeywords: ["Greed", "Control", "Rigidity", "Overattachment"],
    reflection: "How can you hold power in a way that makes others feel safer, not smaller?",
    symbols: ["Bull", "Throne", "Coin"]
  }
];

const swords: CardDefinition[] = [
  {
    name: "Ace of Swords",
    number: "Ace",
    uprightMeaning: "Truth, insight, and a breakthrough that cuts through confusion cleanly.",
    reversedMeaning: "Mental clutter, harshness, or clarity arriving without wisdom or timing.",
    uprightKeywords: ["Clarity", "Truth", "Insight", "Breakthrough"],
    reversedKeywords: ["Confusion", "Harshness", "Miscommunication", "Mental fog"],
    reflection: "What truth needs precision instead of escalation?",
    symbols: ["Crown", "Blade", "Cloud"]
  },
  {
    name: "Two of Swords",
    number: "Two",
    uprightMeaning: "A pause, inner conflict, and the need to feel honestly before deciding.",
    reversedMeaning: "Decision fatigue, denial cracking, or information that can no longer be held back.",
    uprightKeywords: ["Indecision", "Stalemate", "Pause", "Inner conflict"],
    reversedKeywords: ["Overwhelm", "Truth surfacing", "Confusion", "Pressure"],
    reflection: "What are you postponing because it changes the story?",
    symbols: ["Blindfold", "Crossed Swords", "Moonlight"]
  },
  {
    name: "Three of Swords",
    number: "Three",
    uprightMeaning: "Heartbreak, grief, and the sharp honesty of emotional pain that cannot be bypassed.",
    reversedMeaning: "Recovery, reconciliation, or pain beginning to loosen its grip.",
    uprightKeywords: ["Heartbreak", "Truth", "Sorrow", "Separation"],
    reversedKeywords: ["Healing", "Release", "Forgiveness", "Repair"],
    reflection: "What pain asks to be felt cleanly instead of managed around?",
    symbols: ["Heart", "Rain", "Three Blades"]
  },
  {
    name: "Four of Swords",
    number: "Four",
    uprightMeaning: "Rest, retreat, and mental recovery after strain, conflict, or overstimulation.",
    reversedMeaning: "Restlessness, burnout, or returning too early before real recovery has happened.",
    uprightKeywords: ["Rest", "Recovery", "Silence", "Retreat"],
    reversedKeywords: ["Burnout", "Restlessness", "Exhaustion", "Reentry"],
    reflection: "What would actual restoration require from you today?",
    symbols: ["Tomb", "Window", "Sword"]
  },
  {
    name: "Five of Swords",
    number: "Five",
    uprightMeaning: "Conflict, ego-driven victory, and the cost of winning in a way that damages trust.",
    reversedMeaning: "Making amends, ending a draining fight, or refusing to keep feeding hostility.",
    uprightKeywords: ["Conflict", "Ego", "Tension", "Aftermath"],
    reversedKeywords: ["Resolution", "Regret", "Peace-making", "De-escalation"],
    reflection: "What are you trying to win, and is it worth the relational price?",
    symbols: ["Swords", "Storm", "Figure Turning Away"]
  },
  {
    name: "Six of Swords",
    number: "Six",
    uprightMeaning: "Transition, passage, and moving from turbulence toward a quieter shore.",
    reversedMeaning: "Difficulty moving on, unresolved baggage, or resistance slowing a necessary transition.",
    uprightKeywords: ["Transition", "Relief", "Travel", "Healing"],
    reversedKeywords: ["Resistance", "Baggage", "Stagnation", "Turbulence"],
    reflection: "What are you taking with you that may not need to come further?",
    symbols: ["Boat", "Water", "Cloak"]
  },
  {
    name: "Seven of Swords",
    number: "Seven",
    uprightMeaning: "Strategy, stealth, or acting indirectly because trust, honesty, or courage is compromised.",
    reversedMeaning: "Confession, exposure, or the strain of carrying deception too long.",
    uprightKeywords: ["Strategy", "Secrecy", "Self-interest", "Cunning"],
    reversedKeywords: ["Exposure", "Confession", "Accountability", "Conscience"],
    reflection: "Where are you being clever because you are afraid to be direct?",
    symbols: ["Footprints", "Camp", "Stolen Swords"]
  },
  {
    name: "Eight of Swords",
    number: "Eight",
    uprightMeaning: "Restriction, overthinking, and feeling trapped by narratives that are not fully true.",
    reversedMeaning: "Release, perspective, or the first move out of a mental prison.",
    uprightKeywords: ["Restriction", "Fear", "Overthinking", "Self-limitation"],
    reversedKeywords: ["Freedom", "Clarity", "Empowerment", "Action"],
    reflection: "What limitation is real, and what is only rehearsed?",
    symbols: ["Bindings", "Blindfold", "Mud"]
  },
  {
    name: "Nine of Swords",
    number: "Nine",
    uprightMeaning: "Anxiety, rumination, and suffering amplified in the dark of the mind.",
    reversedMeaning: "Relief, perspective, or the need to seek support instead of cycling alone.",
    uprightKeywords: ["Anxiety", "Rumination", "Insomnia", "Fear"],
    reversedKeywords: ["Release", "Support", "Hope", "Stabilizing"],
    reflection: "What fear grows larger at night because it is asking for witness, not secrecy?",
    symbols: ["Bed", "Hands", "Nine Blades"]
  },
  {
    name: "Ten of Swords",
    number: "Ten",
    uprightMeaning: "Collapse, finality, and a painful ending that also prevents further pretending.",
    reversedMeaning: "Recovery, resilience, or refusing to let an ending define the whole story.",
    uprightKeywords: ["Ending", "Betrayal", "Finality", "Truth"],
    reversedKeywords: ["Recovery", "Resilience", "Survival", "New dawn"],
    reflection: "What truth becomes unavoidable once the old version is fully over?",
    symbols: ["Dawn", "Body", "Ten Blades"]
  },
  {
    name: "Page of Swords",
    number: "Page",
    uprightMeaning: "Curiosity, vigilance, and a sharp mind eager to learn, question, and observe.",
    reversedMeaning: "Gossip, defensiveness, or mental energy scattered into reaction instead of understanding.",
    uprightKeywords: ["Curiosity", "Alertness", "Learning", "Ideas"],
    reversedKeywords: ["Gossip", "Impulsiveness", "Defensiveness", "Scattered thinking"],
    reflection: "How can you stay curious without turning watchful energy into suspicion?",
    symbols: ["Wind", "Sword", "Clouds"]
  },
  {
    name: "Knight of Swords",
    number: "Knight",
    uprightMeaning: "Speed, conviction, and direct action driven by strong ideas or urgency.",
    reversedMeaning: "Impulsiveness, aggression, or charging ahead before the facts or people can keep up.",
    uprightKeywords: ["Drive", "Boldness", "Directness", "Momentum"],
    reversedKeywords: ["Impulsiveness", "Aggression", "Carelessness", "Conflict"],
    reflection: "Where does your urgency need wisdom to avoid becoming damage?",
    symbols: ["Charging Horse", "Storm", "Raised Sword"]
  },
  {
    name: "Queen of Swords",
    number: "Queen",
    uprightMeaning: "Discernment, candor, and compassion expressed through clean boundaries and clear language.",
    reversedMeaning: "Cutting words, cynicism, or truth used more as armor than as service.",
    uprightKeywords: ["Discernment", "Truth", "Boundaries", "Clarity"],
    reversedKeywords: ["Cynicism", "Coldness", "Bitterness", "Sharp speech"],
    reflection: "Where would directness be kinder than ambiguity?",
    symbols: ["Butterfly", "Sword", "Wind"]
  },
  {
    name: "King of Swords",
    number: "King",
    uprightMeaning: "Judgment, strategy, and intellectual authority grounded in fairness and principle.",
    reversedMeaning: "Harsh authority, emotional detachment, or intellect weaponized into domination.",
    uprightKeywords: ["Authority", "Reason", "Strategy", "Fairness"],
    reversedKeywords: ["Coldness", "Domination", "Rigidity", "Manipulation"],
    reflection: "What decision would look strongest if it were led by principle rather than pride?",
    symbols: ["Throne", "Sword", "Storm Sky"]
  }
];

const wands: CardDefinition[] = [
  {
    name: "Ace of Wands",
    number: "Ace",
    uprightMeaning: "Vitality, invention, and a spark that wants motion before overthinking cools it.",
    reversedMeaning: "Creative hesitation, impatience, or energy scattered before it finds form.",
    uprightKeywords: ["Inspiration", "Initiative", "Energy", "Potential"],
    reversedKeywords: ["Delay", "Burnout", "False start", "Blocked spark"],
    reflection: "What wants action before overthinking drains it?",
    symbols: ["Flame", "Sprout", "Hand"]
  },
  {
    name: "Two of Wands",
    number: "Two",
    uprightMeaning: "Planning, vision, and standing at the edge of expansion with growing confidence.",
    reversedMeaning: "Fear of the unknown, narrow planning, or a vision that never leaves the walls of the mind.",
    uprightKeywords: ["Planning", "Vision", "Expansion", "Choice"],
    reversedKeywords: ["Fear", "Hesitation", "Limited view", "Delay"],
    reflection: "What future are you ready to plan for more seriously?",
    symbols: ["Globe", "Wall", "Wands"]
  },
  {
    name: "Three of Wands",
    number: "Three",
    uprightMeaning: "Foresight, momentum, and signs that your efforts are beginning to travel further than you.",
    reversedMeaning: "Frustration, delays, or plans that need a broader perspective to move.",
    uprightKeywords: ["Expansion", "Momentum", "Foresight", "Opportunity"],
    reversedKeywords: ["Delay", "Obstacle", "Small thinking", "Frustration"],
    reflection: "Where do you need to think past the first horizon?",
    symbols: ["Ships", "Cliff", "Wands"]
  },
  {
    name: "Four of Wands",
    number: "Four",
    uprightMeaning: "Celebration, stability, and the pleasure of pausing to honor what has been built.",
    reversedMeaning: "Instability, postponed joy, or tension where there should be ease and welcome.",
    uprightKeywords: ["Celebration", "Homecoming", "Stability", "Joy"],
    reversedKeywords: ["Tension", "Delay", "Lack of support", "Instability"],
    reflection: "What deserves to be celebrated before you rush to the next thing?",
    symbols: ["Garland", "Arch", "Lanterns"]
  },
  {
    name: "Five of Wands",
    number: "Five",
    uprightMeaning: "Competition, friction, and the heat that emerges when many wills want the same space.",
    reversedMeaning: "De-escalation, inner conflict, or a chance to redirect chaos into coordination.",
    uprightKeywords: ["Competition", "Friction", "Debate", "Testing"],
    reversedKeywords: ["Resolution", "Avoidance", "Coordination", "Inner tension"],
    reflection: "Which conflict is sharpening you, and which one is just consuming energy?",
    symbols: ["Crossed Wands", "Crowd", "Dust"]
  },
  {
    name: "Six of Wands",
    number: "Six",
    uprightMeaning: "Recognition, momentum, and visible progress earned in public view.",
    reversedMeaning: "Fragile ego, stalled validation, or success measured too externally.",
    uprightKeywords: ["Recognition", "Progress", "Confidence", "Victory"],
    reversedKeywords: ["Ego", "Delay", "Insecurity", "Needing approval"],
    reflection: "How can you honor progress without outsourcing your worth?",
    symbols: ["Laurel", "Banner", "Horse"]
  },
  {
    name: "Seven of Wands",
    number: "Seven",
    uprightMeaning: "Defense, conviction, and holding your ground when pressure tests your resolve.",
    reversedMeaning: "Exhaustion, overwhelm, or giving up a position because the fight has worn you down.",
    uprightKeywords: ["Defensiveness", "Courage", "Perseverance", "Boundaries"],
    reversedKeywords: ["Burnout", "Overwhelm", "Retreat", "Pressure"],
    reflection: "What is genuinely worth defending, and what are you defending out of habit?",
    symbols: ["Hill", "Wand", "Opposing Staffs"]
  },
  {
    name: "Eight of Wands",
    number: "Eight",
    uprightMeaning: "Speed, movement, and developments arriving quickly once resistance clears.",
    reversedMeaning: "Delays, crossed signals, or energy scattering before it can land cleanly.",
    uprightKeywords: ["Momentum", "News", "Travel", "Acceleration"],
    reversedKeywords: ["Delay", "Miscommunication", "Frustration", "Scatter"],
    reflection: "What needs a fast response, and what only feels urgent because it is noisy?",
    symbols: ["Flight", "Sky", "Wands"]
  },
  {
    name: "Nine of Wands",
    number: "Nine",
    uprightMeaning: "Resilience, vigilance, and the grit to stay standing after repeated strain.",
    reversedMeaning: "Paranoia, depletion, or a posture of defense that no longer serves the moment.",
    uprightKeywords: ["Resilience", "Persistence", "Boundaries", "Preparedness"],
    reversedKeywords: ["Exhaustion", "Guardedness", "Paranoia", "Rigidity"],
    reflection: "Where is your endurance wise, and where is it keeping you in survival mode?",
    symbols: ["Bandage", "Fence", "Staff"]
  },
  {
    name: "Ten of Wands",
    number: "Ten",
    uprightMeaning: "Burden, responsibility, and effort becoming unsustainable because it is carried alone.",
    reversedMeaning: "Delegation, release, or collapse after trying to prove you can hold everything.",
    uprightKeywords: ["Burden", "Responsibility", "Overload", "Duty"],
    reversedKeywords: ["Release", "Delegation", "Burnout", "Relief"],
    reflection: "What can be set down without abandoning what matters?",
    symbols: ["Bundle", "Road", "Bent Figure"]
  },
  {
    name: "Page of Wands",
    number: "Page",
    uprightMeaning: "Discovery, enthusiasm, and a lively invitation to explore something with beginner's fire.",
    reversedMeaning: "Restlessness, impatience, or promising energy that is not yet disciplined enough to land.",
    uprightKeywords: ["Discovery", "Enthusiasm", "Message", "Exploration"],
    reversedKeywords: ["Restlessness", "Delay", "Immaturity", "Scattered action"],
    reflection: "What would happen if you followed curiosity with just enough discipline to give it shape?",
    symbols: ["Salamander", "Staff", "Desert"]
  },
  {
    name: "Knight of Wands",
    number: "Knight",
    uprightMeaning: "Bold movement, charisma, and momentum fueled by passion and appetite for experience.",
    reversedMeaning: "Impulsiveness, inconsistency, or heat that burns fast and leaves little sustained behind.",
    uprightKeywords: ["Adventure", "Passion", "Boldness", "Movement"],
    reversedKeywords: ["Impulsiveness", "Inconsistency", "Recklessness", "Volatility"],
    reflection: "Where does your passion need direction so it becomes momentum rather than wildfire?",
    symbols: ["Horse", "Flame", "Wand"]
  },
  {
    name: "Queen of Wands",
    number: "Queen",
    uprightMeaning: "Magnetism, confidence, and creative heat tempered with generosity.",
    reversedMeaning: "Jealousy, burnout, or charisma strained by insecurity and overextension.",
    uprightKeywords: ["Confidence", "Charm", "Creativity", "Leadership"],
    reversedKeywords: ["Jealousy", "Burnout", "Insecurity", "Volatility"],
    reflection: "Where can you lead by presence rather than force?",
    symbols: ["Sunflower", "Black Cat", "Wand"]
  },
  {
    name: "King of Wands",
    number: "King",
    uprightMeaning: "Visionary leadership, courage, and the ability to inspire movement at scale.",
    reversedMeaning: "Arrogance, impatience, or leadership warped by ego and unchecked force.",
    uprightKeywords: ["Vision", "Leadership", "Enterprise", "Courage"],
    reversedKeywords: ["Arrogance", "Impulsiveness", "Domination", "Temper"],
    reflection: "What vision asks you to lead with conviction and restraint at the same time?",
    symbols: ["Lion", "Throne", "Wand"]
  }
];

export const tarotCards: TarotCard[] = [
  ...majorArcana.map(createMajorCard),
  ...cups.map((card) => createMinorCard("Cups", card)),
  ...pentacles.map((card) => createMinorCard("Pentacles", card)),
  ...swords.map((card) => createMinorCard("Swords", card)),
  ...wands.map((card) => createMinorCard("Wands", card))
];

const expectedDeckSize = 78;
const uniqueSlugs = new Set(tarotCards.map((card) => card.slug));

if (tarotCards.length !== expectedDeckSize) {
  throw new Error(`Expected ${expectedDeckSize} tarot cards, received ${tarotCards.length}.`);
}

if (uniqueSlugs.size !== tarotCards.length) {
  throw new Error("Tarot deck contains duplicate card slugs.");
}
