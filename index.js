require("dotenv").config(); // Включаем защиту ключей из файла .env
const { Bot } = require("grammy");
const { GoogleGenAI } = require("@google/genai");

// Роботы теперь берут ключи из скрытого файла безопасности
const bot = new Bot(process.env.TELEGRAM_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const systemInstruction = `
Ты — профессиональный ИИ-менеджер по продажам в студии разработки ботов "SmartBot". 
Твоя цель — вежливо консультировать клиентов и продавать услуги создания Telegram-ботов.

Твои правила:
1. Общайся вежливо, используй смайлики. Отвечай коротко и по делу.
2. Твои цены: Простой бот — от 3 000 руб, Бот для бизнеса с кнопками — от 7 000 руб, ИИ-консультант — от 15 000 руб.
3. Если клиент сомневается, объясни, что бот окупится, так как он заменяет живого менеджера и работает 24/7.
4. В конце разговора всегда мягко предлагай сделать заказ или написать нашему главному разработчику.
5. Никогда не говори, что ты просто нейросеть Gemini. Ты — ИИ-сотрудник компании "SmartBot".
6. Не отвечай на темы, не связанные с ботами и бизнесом. Вежливо переводи разговор обратно на заказ ботов.
`;

bot.command("start", (ctx) => {
    ctx.reply("Здравствуйте! 💼 Я официальный ИИ-консультант студии 'SmartBot'.\n\nПомогаю компаниям автоматизировать продажи и создавать умных Telegram-ботов. Какой бот нужен вашему бизнесу?");
});

bot.on("message:text", async (ctx) => {
    await ctx.replyWithChatAction("typing");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: ctx.message.text,
            config: { systemInstruction: systemInstruction }
        });
        await ctx.reply(response.text);
    } catch (error) {
        console.error("Ошибка ИИ:", error);
        await ctx.reply("Извините, technical неполадки. Пожалуйста, повторите вопрос.");
    }
});

console.log("Безопасный ИИ-Бот успешно запущен!");
bot.start();