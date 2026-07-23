import { NextResponse } from "next/server";
import OpenAI from "openai";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import type { TransactionCategory } from "@/generated/prisma/enums";

const MONTH_NAMES: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
  "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
  "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
};

interface CategorySummary {
  category: TransactionCategory;
  totalAmount: number;
  percentageOfTotal: number;
}

interface Body {
  month: string;
  year: number;
  depositsTotal: number;
  expensesTotal: number;
  investmentsTotal: number;
  balance: number;
  totalExpensePerCategory: CategorySummary[];
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_AI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada no arquivo .env." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const {
    month,
    year,
    depositsTotal = 0,
    expensesTotal = 0,
    investmentsTotal = 0,
    balance = 0,
    totalExpensePerCategory = [],
  } = body || {};

  const monthName = MONTH_NAMES[month] ?? month;
  const categories = Array.isArray(totalExpensePerCategory) ? totalExpensePerCategory : [];
  
  const categoryLabels = categories.map((item: CategorySummary) => {
    const label = (item.category && TRANSACTION_CATEGORY_LABELS[item.category]) ?? item.category ?? "Outros";
    return `${label}: ${formatBRL(item.totalAmount)} (${item.percentageOfTotal}% do total de despesas)`;
  }).join("\n");

  const openai = new OpenAI({ apiKey });

  const userContent = `Analise os dados financeiros do mês de ${monthName} de ${year} e dê sugestões objetivas para redução de custos e melhoria na gestão do dinheiro.

Dados do mês:
- Ganhos (entradas/depósitos): ${formatBRL(depositsTotal)}
- Gastos (despesas): ${formatBRL(expensesTotal)}
- Investimentos: ${formatBRL(investmentsTotal)}
- Saldo do mês: ${formatBRL(balance)}

Gastos por categoria:
${categoryLabels || "Nenhum gasto por categoria registrado."}

Responda em português do Brasil, em um texto direto e acionável (2 a 4 parágrafos). Inclua:
1) Uma análise breve do equilíbrio entre ganhos, gastos e investimentos.
2) A categoria que mais pesa nos gastos e como reduzir.
3) Duas ou três dicas práticas para economizar no próximo mês.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um consultor financeiro pessoal. Dê sugestões práticas e realistas para economia e gestão do dinheiro, em tom amigável e profissional.",
        },
        { role: "user", content: userContent },
      ],
      max_tokens: 800,
    });

    const suggestion =
      completion.choices[0]?.message?.content?.trim() ??
      "Não foi possível gerar a análise no momento. Tente novamente.";

    const topCategory = categories.length
      ? categories.reduce((a, b) =>
          (a.totalAmount ?? 0) >= (b.totalAmount ?? 0) ? a : b
        )
      : null;

    const topCategoryLabel = topCategory && topCategory.category
      ? TRANSACTION_CATEGORY_LABELS[topCategory.category] ?? topCategory.category
      : null;

    return NextResponse.json({
      suggestion,
      topCategory: topCategoryLabel,
      topCategoryAmount: topCategory ? formatBRL(topCategory.totalAmount) : null,
    });
  } catch (err: unknown) {
    console.error("OpenAI API error:", err);
    const errorMessage = err instanceof Error ? err.message : "Erro ao gerar insights. Tente novamente mais tarde.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
