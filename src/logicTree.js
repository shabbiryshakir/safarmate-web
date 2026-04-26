export const initialLogicTree = {
  "start": {
    id: "start",
    type: "question",
    text_en: "What is your primary mode of transport?",
    text_lsd: "تمهارے سفر كي سواري كيا هے؟",
    options: [
      { label_en: "Car/Taxi", label_lsd: "گاڑي", next: "q_mecca", set: { transport: "car" } },
      { label_en: "Airplane", label_lsd: "هوائي جہاز", next: "q_mecca", set: { transport: "plane", origin: "airport" } },
      { label_en: "Train", label_lsd: "ٹرين", next: "q_mecca", set: { transport: "train", origin: "airport" } }
    ]
  },
  "q_mecca": {
    id: "q_mecca",
    type: "question",
    text_en: "Is your destination Mecca?",
    text_lsd: "كيا تمهارا ارادہ مکہ معظمہ جانے كا هے؟",
    options: [
      { label_en: "Yes", label_lsd: "هان", next: "dashboard", set: { isMecca: true, status: "MUQEEM" } },
      { label_en: "No", label_lsd: "نهين", next: "q_distance", set: { isMecca: false } }
    ]
  },
  "q_distance": {
    id: "q_distance",
    type: "question",
    text_en: "Is the destination at least 12 miles away (24 round trip)?",
    text_lsd: "كيا تمهارا ارادہ 12 مائل يا اس سي زيادہ سفر كا هے؟",
    options: [
      { label_en: "Yes", label_lsd: "هان", next: "q_origin" },
      { label_en: "No", label_lsd: "نهين", next: "dashboard", set: { status: "MUQEEM", error: "Distance too short" } }
    ]
  },
  "q_origin": {
    id: "q_origin",
    type: "question",
    text_en: "From where are you departing?",
    text_lsd: "يہ سفر تم كهاں سے شروع كر رهے هو؟",
    options: [
      { label_en: "My House", label_lsd: "اپنے گهر سے", next: "q_fasting", set: { status: "MUSAFIR", origin: "house", departed: true } },
      { label_en: "Secondary House/Station", label_lsd: "دوسرے گهر يا اسٹيشن سے", next: "q_hadd" }
    ]
  },
  "q_hadd": {
    id: "q_hadd",
    type: "question",
    text_en: "Is this location inside your town boundary (Hadd)?",
    text_lsd: "كيا يہ جگه تمهارے شهر كي حد كے اندر هے؟",
    options: [
      { label_en: "Inside", label_lsd: "حد كے اندر", next: "standby", set: { status: "MUQEEM", location: "inside" } },
      { label_en: "Outside", label_lsd: "حد كے باهر", next: "q_fasting", set: { status: "MUSAFIR", departed: true } }
    ]
  }
  // ... more nodes can be added here
};