import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PublicHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  nameEn: string;
  nameTh: string;
  nameMy: string;
  type: "Buddhist" | "Royal" | "Secular";
  description: string;
  conciergeNote: string;
}

const THAI_HOLIDAYS_2026: PublicHoliday[] = [
  {
    id: "h1",
    date: "2026-01-01",
    nameEn: "New Year's Day",
    nameTh: "วันขึ้นปีใหม่",
    nameMy: "နှစ်သစ်ကူးနေ့",
    type: "Secular",
    description: "နိုင်ငံတကာ နှစ်သစ်ကူးနေ့ ဖြစ်ပါသည်။ ထိုင်းတစ်နိုင်ငံလုံး ရုံးပိတ်ရက် ဖြစ်ပါသည်။",
    conciergeNote: "ဆေးရုံအများစုတွင် ပုံမှန်ပြင်ပလူနာဌာန (OPD) များ ပိတ်ထားတတ်သော်လည်း အရေးပေါ်လူနာဌာန (ER) များ ပုံမှန်အတိုင်း ၂၄ နာရီ ဖွင့်လှစ်ထားရှိပါသည်။ အထူးကုချိန်းဆိုမှုများကို ရှောင်ရှားသင့်ပါသည်။",
  },
  {
    id: "h2",
    date: "2026-03-02",
    nameEn: "Makha Bucha Day",
    nameTh: "วันมาฆบูชา",
    nameMy: "မာခါဘူချာနေ့",
    type: "Buddhist",
    description: "မြတ်စွာဘုရားသည် သာဝက ၁,၂၅၀ ပါးအား သြဝါဒပါတိမောက် တရားဦးဟောကြားတော်မူခြင်းကို အထိမ်းအမှတ်ပြုသော နေ့မြတ်ဖြစ်သည်။",
    conciergeNote: "ဗုဒ္ဓဘာသာဆိုင်ရာ အလွန်မြင့်မြတ်သော နေ့ဖြစ်၍ အရက်သေစာ ရောင်းချမှု တစ်နိုင်ငံလုံး လုံးဝပိတ်ပင်ထားပါသည်။ အစိုးရရုံးများ ပိတ်သော်လည်း ပုဂ္ဂလိကဆေးရုံကြီးများ ပုံမှန်လည်ပတ်ပါသည်။",
  },
  {
    id: "h3",
    date: "2026-04-06",
    nameEn: "Chakri Memorial Day",
    nameTh: "วันจักรี",
    nameMy: "ချက်ကရီမင်းဆက် အထိမ်းအမှတ်နေ့",
    type: "Royal",
    description: "ယနေ့ခေတ် ထိုင်းဗဟိုနိုင်ငံတော်ကို တည်ထောင်ခဲ့သည့် ချက်ကရီမင်းဆက် စတင်ခြင်း အထိမ်းအမှတ်နေ့ ဖြစ်သည်။",
    conciergeNote: "အစိုးရရုံများနှင့် သံရုံးများ ပိတ်ထားမည်ဖြစ်ပြီး ဗီဇာသက်တမ်းတိုးရက်များကို Shwe Thai ရုံးမှ ကြိုတင်ညှိနှိုင်းစီစဉ်ပေးပါမည်။ ပုဂ္ဂလိက ဆေးရုံကြီးများ ဆေးကုသမှု ပုံမှန်အတိုင်း လက်ခံပါသည်။",
  },
  {
    id: "h4",
    date: "2026-04-13",
    nameEn: "Songkran Festival Day 1",
    nameTh: "วันสงกรานต์",
    nameMy: "သင်္ကြန် ရိုးရာရေသဘင်ပွဲတော် (ပထမနေ့)",
    type: "Secular",
    description: "ထိုင်းရိုးရာနှစ်သစ်ကူးဖြစ်ပြီး မိသားစုဆုံဆည်းခြင်းနှင့် ဘုရားကျောင်းများတွင် ရေသွန်းခြင်းများပြုလုပ်ကြသည်။",
    conciergeNote: "လမ်းမများပေါ်တွင် ရေပက်ကစားမှုများ အလွန်ပြင်းထန်သဖြင့် သွားလာရေး အဆင်မပြေဖြစ်တတ်သည်။ လမ်းပန်းဆက်သွယ်ရေး အလွန်ကျပ်ညှပ်တတ်သဖြင့် ဆေးရုံသွားရောက်ရန် Shwe Thai VIP ကားများကို စောစောထွက်ခွာစေပါမည်။",
  },
  {
    id: "h5",
    date: "2026-04-14",
    nameEn: "Songkran Festival Day 2",
    nameTh: "วันสงกรานต์ (วันครอบครัว)",
    nameMy: "သင်္ကြန် ရိုးရာရေသဘင်ပွဲတော် (မိသားစုနေ့)",
    type: "Secular",
    description: "မိသားစု အရိုအသေပေးသောနေ့နှင့် သင်္ကြန်ပွဲတော် အလယ်ရက် ဖြစ်သည်။",
    conciergeNote: "ဆေးရုံဝန်ထမ်းများနှင့် ဆရာဝန်ကြီးများ၏ 休暇 (ခွင့်ရက်) များသောကြောင့် ဆေးကုသမှုချိန်းဆိုမှုများကို သင်္ကြန်ကာလအတွင်း အတတ်နိုင်ဆုံး ရှောင်ကြဉ်ပြီး ကြိုတင် သို့မဟုတ် နောက်ပိုင်းမှ စီစဉ်ရန် အကြံပြုပါသည်။",
  },
  {
    id: "h6",
    date: "2026-04-15",
    nameEn: "Songkran Festival Day 3",
    nameTh: "วันสงกรานต์ (วันเถลิงศก)",
    nameMy: "သင်္ကြန် ရိုးရာရေသဘင်ပွဲတော် (အတက်နေ့)",
    type: "Secular",
    description: "ထိုင်းရိုးရာ မဟာသင်္ကြန်နှစ်သစ်ကူး အတက်နေ့ ဖြစ်သည်။",
    conciergeNote: "ဆေးရုံသို့ အရေးပေါ်သွားရောက်ရန် လိုအပ်ပါက Shwe Thai M.B.,B.S ဦးဆောင်သော ဆေးဘက်ဆိုင်ရာ ညှိနှိုင်းရေးမှူးအဖွဲ့မှ ဆေးရုံအရေးပေါ်ဌာနနှင့် တိုက်ရိုက် ဆက်သွယ်ဆောင်ရွက်ပေးပါမည်။",
  },
  {
    id: "h7",
    date: "2026-05-01",
    nameEn: "National Labour Day",
    nameTh: "วันแรงงานแห่งชาติ",
    nameMy: "အမျိုးသား အလုပ်သမားနေ့",
    type: "Secular",
    description: "အလုပ်သမားများ၏ အခန်းကဏ္ဍကို ဂုဏ်ပြုသောနေ့ဖြစ်ပြီး ဘဏ်များနှင့် စက်ရုံအလုပ်ရုံများ ပိတ်ပါသည်။",
    conciergeNote: "ဘဏ်လုပ်ငန်းများ ပိတ်ထားသဖြင့် ငွေလွှဲခြင်းနှင့် ဆေးရုံငွေချေမှုများကို ကြိုတင်ပြင်ဆင်ရပါမည်။ ဆေးရုံကုသမှုများမှာမူ ပုံမှန်အတိုင်း လည်ပတ်လျက်ရှိပါသည်။",
  },
  {
    id: "h8",
    date: "2026-05-04",
    nameEn: "Coronation Day",
    nameTh: "วันฉัตรมงคล",
    nameMy: "ဘုရင်မင်းမြတ် နန်းတက်ပွဲ အထိမ်းအမှတ်နေ့",
    type: "Royal",
    description: "ဘုရင်မင်းမြတ် မဟာဝဇီရာလင်ကွန်း (ရာမာ ၁၀) ၏ ဘိသိက်ခံ နန်းတက်ပွဲ အခမ်းအနားကို ဂုဏ်ပြုသောနေ့ဖြစ်သည်။",
    conciergeNote: "အစိုးရရုံးများ ပိတ်သည်။ Shwe Thai ၏ လေဆိပ် VIP ပို့ဆောင်ရေးနှင့် ကွန်ဆီးယပ်စ် ဝန်ဆောင်မှုများကို ကန့်သတ်ချက်မရှိ စိတ်ချစွာ အသုံးပြုနိုင်ပါသည်။",
  },
  {
    id: "h9",
    date: "2026-06-01",
    nameEn: "Visakha Bucha Day",
    nameTh: "วันวิสาขบูชา",
    nameMy: "ကဆုန်လပြည့် ဗုဒ္ဓနေ့",
    type: "Buddhist",
    description: "မြတ်စွာဘုရားရှင်၏ ဖွားမြင်တော်မူခြင်း၊ ပွင့်တော်မူခြင်းနှင့် ပရိနိဗ္ဗာန်စံဝင်တော်မူခြင်း တိုက်ဆိုင်သော ကဆုန်လပြည့်နေ့ ဖြစ်သည်။",
    conciergeNote: "ယဉ်ကျေးမှုအရ အလွန်အရေးကြီးပြီး ဘုရားကျောင်းများတွင် လူစည်ကားပါသည်။ အရက်သေစာ ရောင်းချမှု ပိတ်ပင်ထားသည်။ ဆေးရုံများတွင် ကလေးမီးဖွားခြင်းနှင့် ခွဲစိတ်မှုများ ပုံမှန်လုပ်ဆောင်နိုင်ပါသည်။",
  },
  {
    id: "h10",
    date: "2026-06-03",
    nameEn: "H.M. Queen Suthida's Birthday",
    nameTh: "วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี",
    nameMy: "မိဖုရားခေါင်ကြီး သုသီတာ၏ မွေးနေ့တော်",
    type: "Royal",
    description: "ထိုင်းနိုင်ငံ၏ လက်ရှိ မိဖုရားခေါင်ကြီး သုသီတာ၏ မွေးနေ့တော် ဖြစ်သည်။",
    conciergeNote: "အစိုးရရုံးများ ပိတ်သော်လည်း ပုဂ္ဂလိက ဆေးရုံကြီးများ (ဥပမာ - Bumrungrad, Bangkok Hospital, Samitivej) အားလုံး ပုံမှန်အတိုင်း အပြည့်အဝ ဝန်ဆောင်မှုပေးနေပါသည်။",
  },
  {
    id: "h11",
    date: "2026-07-28",
    nameEn: "H.M. King Maha Vajiralongkorn's Birthday",
    nameTh: "วันเฉลิมพระชนมพรรษาสมเด็จพระเจ้าอยู่หัวฯ",
    nameMy: "ဘုရင်မင်းမြတ် မဟာဝဇီရာလင်ကွန်း၏ မွေးနေ့တော်",
    type: "Royal",
    description: "လက်ရှိ ရာမာ (၁၀) ဘုရင်မင်းမြတ်၏ သက်တော်မွေးနေ့တော် အထိမ်းအမှတ် ဖြစ်သည်။",
    conciergeNote: "အစိုးရရုံးများ၊ လူဝင်မှုကြီးကြပ်ရေး (Immigration) ဌာနများနှင့် သံရုံးများ ပိတ်ပါမည်။ Shwe Thai ၏ အခမဲ့ ဗီဇာသက်တမ်းတိုး ညှိနှိုင်းမှု ဝန်ဆောင်မှုကို ဤရက်မတိုင်မီ ကြိုတင် ပြီးစီးအောင် ဆောင်ရွက်ပေးပါမည်။",
  },
  {
    id: "h12",
    date: "2026-07-29",
    nameEn: "Asahna Bucha Day",
    nameTh: "วันอาสฬหบูชา",
    nameMy: "ဓမ္မစကြာအခါတော်နေ့ (ဝါဆိုလပြည့်နေ့)",
    type: "Buddhist",
    description: "မြတ်စွာဘုရားရှင် တရားဦးဟောတော်မူပြီး သံဃာရတနာ စတင်ပေါ်ပေါက်ကာ ရတနာသုံးပါး စုံလင်သော နေ့ထူးနေ့မြတ်ဖြစ်သည်။",
    conciergeNote: "ဝါတွင်းကာလ မတိုင်မီနေ့ ဖြစ်ပြီး ထိုင်းလူမျိုးများ ဘုရားကျောင်းများသို့ အလုံးအရင်း သွားရောက်ပြီး ဆီမီးပူဇော်ကြသည်။ ဆေးကုသမှုဆိုင်ရာ သယ်ယူပို့ဆောင်ရေးတွင် လမ်းပိတ်ဆို့မှုများ ရှိနိုင်ပါသည်။",
  },
  {
    id: "h13",
    date: "2026-07-30",
    nameEn: "Khao Phansa Day (Buddhist Lent)",
    nameTh: "วันเข้าพรรษา",
    nameMy: "ဝါဝင်နေ့မြတ်",
    type: "Buddhist",
    description: "ရဟန်းသံဃာတော်များ သုံးလပတ်လုံး ဝါဆိုဝါကပ်တော်မူသည့် ဝါဝင်ရက်မြတ် ဖြစ်သည်။",
    conciergeNote: "အစိုးရရုံးပိတ်ရက်ဖြစ်ပြီး ယခင်ရက်နှင့်ပေါင်း၍ ရက်ရှည်ပိတ်ရက် ဖြစ်တတ်သည်။ လူနာများ ဆေးရုံသို့လာရောက်ရာတွင် Shwe Thai Coordinator မှ လိုက်ပါကူညီပေးပါမည်။",
  },
  {
    id: "h14",
    date: "2026-08-12",
    nameEn: "H.M. Queen Sirikit's Birthday / Mother's Day",
    nameTh: "วันเฉลิมพระชนมพรรษาสมเด็จพระบรมราชชนนีพันปีหลวง / วันแม่แห่งชาติ",
    nameMy: "မယ်တော်သီရိခေတ် မွေးနေ့နှင့် ထိုင်းနိုင်ငံ အမိနေ့",
    type: "Royal",
    description: "မိဖုရားကြီး သီရိခေတ် သက်တော်မွေးနေ့တော်ဖြစ်ပြီး ထိုင်းနိုင်ငံ၏ မေမေများနေ့လည်း ဖြစ်သည်။ တစ်နိုင်ငံလုံး အပြာရောင်အလံများဖြင့် တန်ဆာဆင်လေ့ရှိသည်။",
    conciergeNote: "ကျန်းမာရေး စစ်ဆေးမှု (Health Screening) ပြုလုပ်လိုသည့် အမေများအတွက် ဆေးရုံအသီးသီးတွင် ပရိုမိုးရှင်း အထူးအစီအစဉ်များ များစွာရှိတတ်သဖြင့် Shwe Thai သို့ ကြိုတင် ဆက်သွယ်အပ်နှံနိုင်ပါသည်။",
  },
  {
    id: "h15",
    date: "2026-10-13",
    nameEn: "King Bhumibol Memorial Day",
    nameTh: "วันคล้ายวันสวรรคต พระบาทสมเด็จพระบรมชนกาธิเบศรฯ",
    nameMy: "ဘုရင်ကြီး ဘူမိဘော အဒူလျာဒက် နတ်ရွာစံခြင်း Memorial နေ့",
    type: "Royal",
    description: "ထိုင်းပြည်သူများ အလွန်ချစ်ခင်ရိုသေရသော ရာမာ (၉) မဟာဘုရင်ကြီး နတ်ရွာစံကွယ်လွန်ခဲ့ခြင်းကို တလေးတစား ဝမ်းနည်းအမှတ်ရသောနေ့ ဖြစ်သည်။",
    conciergeNote: "အလွန်လေးနက်ပြီး ငြိမ်သက်သောအထိမ်းအမှတ်နေ့ ဖြစ်ပါသည်။ ဆေးရုံများခရီးစဉ်အတွင်း ဝမ်းနည်းအထိမ်းအမှတ်အဖြစ် သင့်လျော်သောအရောင်များကို ဝတ်ဆင်ရန် Shwe Thai မှ စီစဉ်ညွှန်ကြားပေးပါမည်။",
  },
  {
    id: "h16",
    date: "2026-10-23",
    nameEn: "Chulalongkorn Memorial Day",
    nameTh: "วันปิยมหาราช",
    nameMy: "ချူလာလောင်ကွန်း ဘုရင်ကြီး အထိမ်းအမှတ်နေ့",
    type: "Royal",
    description: "ထိုင်းနိုင်ငံ၏ ခေတ်မီတိုးတက်ရေးကို အဆောက်အဦးချပေးခဲ့သည့် ရာမာ (၅) ချူလာလောင်ကွန်း ဘုရင်ကြီးကို ဂုဏ်ပြုသောနေ့ဖြစ်သည်။",
    conciergeNote: "ရုံးပိတ်ရက် ဖြစ်သော်လည်း ဆေးဘက်ဆိုင်ရာ coordination tasks များ အနှောင့်အယှက် မရှိ လည်ပတ်ပါသည်။ လေဆိပ်အကြိုအပို့ အားလုံး အဆင်ပြေစေရပါမည်။",
  },
  {
    id: "h17",
    date: "2026-12-05",
    nameEn: "King Bhumibol's Birthday / Father's Day",
    nameTh: "วันคล้ายวันพระบรมราชสมภพ พระบาทสมเด็จพระบรมชนกาธิเบศรฯ / วันพ่อแห่งชาติ",
    nameMy: "ဘုရင်ကြီး ဘူမိဘော မွေးနေ့တော်နှင့် အဖေများနေ့",
    type: "Royal",
    description: "ရာမာ (၉) ဘုရင်ကြီး၏ မွေးနေ့တော်ဖြစ်ပြီး တစ်နိုင်ငံလုံး အဝါရောင်အဝတ်အစားများ ဝတ်ဆင်ကာ ဂုဏ်ပြုကြသည်။ အမျိုးသား ဖခင်များနေ့လည်း ဖြစ်သည်။",
    conciergeNote: "ဆေးရုံများ၌ အမျိုးသားများအတွက် အထူး Check-up package အစီအစဉ်များ တင်ပေးလေ့ရှိသည်။ ချိန်းဆိုမှုများအား Shwe Thai မှ ကူညီဆိုက်ညှိပေးပါမည်။",
  },
  {
    id: "h18",
    date: "2026-12-10",
    nameEn: "Declaration of Constitution Day",
    nameTh: "วันรัฐธรรมนูญ",
    nameMy: "ဖွဲ့စည်းပုံအခြေခံဥပဒေနေ့",
    type: "Secular",
    description: "ထိုင်းနိုင်ငံတွင် သက်ဦးဆံပိုင်စနစ်မှ စည်းမျဉ်းခံဘုရင်စနစ် ဖွဲ့စည်းပုံအခြေခံဥပဒေ စတင်ပြဋ္ဌာန်းခြင်းကို အထိမ်းအမှတ်ပြုသောနေ့ဖြစ်သည်။",
    conciergeNote: "ဘဏ်လုပ်ငန်းများ ပိတ် ပါမည်။ OPD ဆေးကုသမှုအချို့ ပြောင်းလဲနိုင်သော်လည်း ကြိုတင်ချိန်းဆိုထားသော ကုသမှုများအားလုံး Shwe Thai မှ အဆင်ပြေအောင် ကြပ်မတ်ပေးပါမည်။",
  },
  {
    id: "h19",
    date: "2026-12-31",
    nameEn: "New Year's Eve",
    nameTh: "วันสิ้นปี",
    nameMy: "နှစ်ဟောင်းကုန်ဆုံးခြင်းနေ့",
    type: "Secular",
    description: "နှစ်တစ်နှစ်၏ နောက်ဆုံးနေ့ ဖြစ်ပြီး ပျော်ရွှင်စွာ Countdown ပွဲတော်များ ဆင်နွှဲကြသည်။",
    conciergeNote: "နှစ်သစ်ကူးပိတ်ရက်ရှည် ဖြစ်သောကြောင့် ဆေးရုံ ဝန်ထမ်းအင်အား နည်းပါးတတ်သည်။ Shwe Thai အရေးပေါ်ဆက်သွယ်ရန်ဖုန်းနှင့် တာဝန်ကျ ဆေးဘက်စကားပြန်အဖွဲ့မှ မိသားစုဝင်များအတွက် ၂၄ နာရီလုံး အဆင်သင့် ရှိနေပါမည်။",
  },
];

const MONTHS_MY = [
  "ဇန်နဝါရီ (January)",
  "ဖေဖော်ဝါရီ (February)",
  "မတ် (March)",
  "ဧပြီ (April)",
  "မေ (May)",
  "ဇွန် (June)",
  "ဇူလိုင် (July)",
  "သြဂုတ် (August)",
  "စက်တင်ဘာ (September)",
  "အောက်တိုဘာ (October)",
  "နိုဝင်ဘာ (November)",
  "ဒီဇင်ဘာ (December)",
];

const WEEKDAYS_MY = ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"];

export const HolidayCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // Default to current month, but for 2026
  const [filterType, setFilterType] = useState<"All" | "Buddhist" | "Royal" | "Secular">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeHolidayId, setActiveHolidayId] = useState<string | null>(null);

  // Constants
  const year = 2026;

  // Filtered Holidays for list view
  const filteredHolidays = useMemo(() => {
    return THAI_HOLIDAYS_2026.filter((h) => {
      const matchesType = filterType === "All" || h.type === filterType;
      const matchesSearch =
        h.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.nameMy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.nameTh.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  // Active highlighted holiday metadata
  const activeHoliday = useMemo(() => {
    return THAI_HOLIDAYS_2026.find((h) => h.id === activeHolidayId);
  }, [activeHolidayId]);

  // Generate days in month for 2026
  const monthData = useMemo(() => {
    const firstDayIndex = new Date(year, selectedMonth, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, selectedMonth + 1, 0).getDate();

    const days: Array<{
      dayNum: number | null;
      dateStr: string | null;
      holidays: PublicHoliday[];
    }> = [];

    // Fills for preceding days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: null, dateStr: null, holidays: [] });
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(selectedMonth + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const dayHolidays = THAI_HOLIDAYS_2026.filter((h) => h.date === dateStr);

      days.push({
        dayNum: d,
        dateStr,
        holidays: dayHolidays,
      });
    }

    return days;
  }, [selectedMonth]);

  const handleDayClick = (dateStr: string | null, holidays: PublicHoliday[]) => {
    if (holidays.length > 0) {
      setActiveHolidayId(holidays[0].id);
    } else {
      setActiveHolidayId(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50" id="holiday-calendar-container">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-thai-600 animate-pulse"></span>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">
              Thailand Holiday Calendar (၂၀၂၆)
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">
            Shwe Thai Premium Medical Concierge • Operational Intelligence
          </p>
        </div>

        {/* Brand Contact Badge */}
        <div className="flex items-center gap-3 bg-thai-50/30 border border-thai-100 rounded-xl p-3 max-w-sm">
          <div className="p-2 bg-thai-100 rounded-lg text-thai-700">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div className="text-left font-sans">
            <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none">
              Official Client Hotline
            </div>
            <a href="tel:+66972100341" className="text-sm font-extrabold text-thai-800 hover:underline">
              +66 97 210 0341
            </a>
            <div className="text-[10px] text-gray-500 leading-none">www.shwethai.com</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Interactive Month Grid */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            {/* Month Selector Carousel Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedMonth((m) => (m === 0 ? 11 : m - 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <h2 className="text-lg font-bold text-gray-900 tracking-tight font-sans text-center min-w-[200px]">
                {MONTHS_MY[selectedMonth]} {year}
              </h2>

              <button
                onClick={() => setSelectedMonth((m) => (m === 11 ? 0 : m + 1))}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Days of Week Row */}
            <div className="grid grid-cols-7 text-center gap-1.5 md:gap-2 mb-2">
              {WEEKDAYS_MY.map((day, idx) => (
                <div
                  key={day}
                  className={`text-[10px] md:text-sm font-bold uppercase tracking-wider py-1.5 rounded-lg text-gray-400 ${
                    idx === 0 ? "text-rose-400/90" : idx === 6 ? "text-blue-400/90" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Numbers */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {monthData.map((cell, idx) => {
                const isHoliday = cell.holidays.length > 0;
                const topHoliday = cell.holidays[0];
                const isDaySelected = topHoliday && topHoliday.id === activeHolidayId;

                let cellBg = "bg-white hover:bg-gray-50 text-gray-800";
                let holidayDotColor = "";

                if (isHoliday) {
                  const type = topHoliday.type;
                  if (type === "Buddhist") {
                    cellBg = "bg-amber-50/55 text-amber-900 hover:bg-amber-100/60 border border-amber-200/40";
                    holidayDotColor = "bg-amber-500";
                  } else if (type === "Royal") {
                    cellBg = "bg-purple-50/55 text-purple-900 hover:bg-purple-100/60 border border-purple-200/40";
                    holidayDotColor = "bg-purple-500";
                  } else {
                    cellBg = "bg-red-50/55 text-red-900 hover:bg-red-100/60 border border-red-200/40";
                    holidayDotColor = "bg-red-500";
                  }
                }

                if (isDaySelected) {
                  cellBg = "ring-2 ring-thai-500 bg-thai-50 text-thai-950 scale-[1.02] z-10 font-bold";
                }

                if (cell.dayNum === null) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="aspect-square bg-gray-50/30 rounded-xl border border-transparent"
                    ></div>
                  );
                }

                return (
                  <button
                    key={`day-${cell.dayNum}`}
                    onClick={() => handleDayClick(cell.dateStr, cell.holidays)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-1.5 md:p-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-gray-100 relative ${cellBg}`}
                  >
                    {/* Day number */}
                    <span className="text-xs md:text-sm font-bold self-start">
                      {cell.dayNum}
                    </span>

                    {/* Holiday Indicator */}
                    {isHoliday && (
                      <div className="flex flex-col items-center gap-1 w-full">
                        <span className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full ${holidayDotColor} animate-pulse shadow-sm`}></span>
                        <span className="hidden md:block text-[8px] font-extrabold max-w-full truncate text-center opacity-90 px-0.5">
                          {topHoliday.nameMy}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Legend Info */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/30 border border-amber-100/50 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-[10px] md:text-xs font-bold text-amber-800">ဓမ္မနေ့ပိတ်ရက် (Buddhist)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50/30 border border-purple-100/50 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-[10px] md:text-xs font-bold text-purple-800">နန်းတွင်းပွဲတော် (Royal)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50/30 border border-red-100/50 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] md:text-xs font-bold text-red-800">အစိုးရရုံးပိတ်ရက် (Secular)</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Details & Holiday List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Holiday Detail Card (Dynamic display) */}
          <AnimatePresence mode="wait">
            {activeHoliday ? (
              <motion.div
                key={activeHoliday.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-gradient-to-br from-slate-900 to-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 overflow-hidden"
              >
                <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-thai-600/90 text-white px-2.5 py-1 rounded-full">
                    {activeHoliday.type} Holiday
                  </span>
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    {new Date(activeHoliday.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="p-6">
                  {/* Names */}
                  <h3 className="text-lg font-black tracking-tight mb-1 text-thai-300">
                    {activeHoliday.nameEn}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase italic tracking-wide mb-3">
                    {activeHoliday.nameTh}
                  </p>
                  <div className="text-sm font-semibold text-slate-100 mb-4 py-2 border-y border-white/5 leading-relaxed">
                    {activeHoliday.nameMy}
                  </div>

                  {/* Holiday cultural meaning */}
                  <div className="mb-4">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                      ပွဲတော်အကြောင်းအရာ
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {activeHoliday.description}
                    </p>
                  </div>

                  {/* Shwe Thai Concierge Notes */}
                  <div className="bg-thai-600/10 border border-thai-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1.5 text-thai-400">
                      <svg
                        className="w-4 h-4 text-thai-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <h4 className="text-[10px] uppercase font-extrabold tracking-wider leading-none">
                        Shwe Thai Operational Guidelines
                      </h4>
                    </div>
                    <p className="text-xs text-thai-100 leading-relaxed font-semibold">
                      {activeHoliday.conciergeNote}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveHolidayId(null)}
                  className="w-full text-center py-3 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all border-t border-white/5"
                >
                  အသေးစိတ်ပိတ်ပါ
                </button>
              </motion.div>
            ) : (
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-thai-100/50 rounded-full flex items-center justify-center text-thai-600 mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">ချိန်းဆိုမှု ကြည့်ရန်</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-semibold">
                  ပြက္ခဒိန်ပေါ်ရှိ ဆေးရောင်ခြယ်ထားသော ရက်များကိုနှိပ်၍ ပိတ်ရက်ဖြစ်စဉ်၊ လူလာရောက်မှုနှင့် Shwe Thai ဆေးရုံအကြိုအပို့ လမ်းညွှန်ချက်များကို ကြည့်ရှုပါ။
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Holiday List Grid & Search Filter (Highly customizable) */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex-1 flex flex-col">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
              ပိတ်ရက်များ စာရင်း ({filteredHolidays.length})
            </h3>

            {/* Simple Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="ရှာဖွေရန်..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-thai-400 transition-all text-gray-800 placeholder-gray-400"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Pill Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {(["All", "Buddhist", "Royal", "Secular"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg tracking-wide transition-all ${
                    filterType === type
                      ? "bg-thai-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {type === "All"
                    ? "အားလုံး"
                    : type === "Buddhist"
                    ? "ဗုဒ္ဓ"
                    : type === "Royal"
                    ? "နန်းတော်"
                    : "အစိုးရ"}
                </button>
              ))}
            </div>

            {/* Feed Scroll Container */}
            <div className="overflow-y-auto max-h-[340px] pr-1 space-y-2 flex-grow">
              {filteredHolidays.map((holiday) => {
                const isActive = holiday.id === activeHolidayId;
                let badgeStyle = "bg-red-50 text-red-600 border border-red-100";
                if (holiday.type === "Buddhist") {
                  badgeStyle = "bg-amber-50 text-amber-700 border border-amber-100";
                } else if (holiday.type === "Royal") {
                  badgeStyle = "bg-purple-50 text-purple-700 border border-purple-100";
                }

                return (
                  <button
                    key={holiday.id}
                    onClick={() => {
                      setActiveHolidayId(holiday.id);
                      // Auto select correct month
                      const dateObj = new Date(holiday.date);
                      setSelectedMonth(dateObj.getMonth());
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 items-start ${
                      isActive
                        ? "bg-slate-50 border-slate-900"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-black text-slate-400 font-mono">
                        {holiday.date}
                      </span>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${badgeStyle}`}>
                        {holiday.type}
                      </span>
                    </div>

                    <div className="text-xs font-black text-gray-900 tracking-tight leading-tight">
                      {holiday.nameEn}
                    </div>
                    <div className="text-[11px] font-bold text-gray-500 leading-normal">
                      {holiday.nameMy}
                    </div>
                  </button>
                );
              })}

              {filteredHolidays.length === 0 && (
                <div className="text-center py-8 text-gray-300 font-semibold text-xs">
                  ပိတ်ရက် ရှာမတွေ့ပါ။
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
