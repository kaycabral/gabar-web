/**
 * Status-based mutability rules — drives incremental scraping.
 *
 * `stable` exams (closed) têm dado frozen — não vale re-fetchar detail page
 * nem reprocessar documents. `mutable` (open/upcoming/ongoing) continuam mexendo.
 */

import type { ExamStatus } from '../types/exam'

const STABLE_STATUSES = new Set<ExamStatus>(['closed'])

export function isStableStatus(status: ExamStatus | null | undefined): boolean {
  return status != null && STABLE_STATUSES.has(status)
}

export function isMutableStatus(status: ExamStatus | null | undefined): boolean {
  return !isStableStatus(status)
}

/**
 * Decide se vale fetch da detail page de um exam dado:
 *
 *   - listingStatus: status reportado pela listing page (atual, da banca)
 *   - firestoreStatus: status persistido (last known)
 *
 * Regras:
 *   1. Exam novo (sem registro em Firestore) → fetch
 *   2. Status diferente entre listing e Firestore → fetch (captura transição)
 *   3. Ambos stable e iguais → skip (frozen)
 *   4. Mutable em qualquer lado → fetch
 *
 * Garantia crítica (ADR §3): qualquer transição é capturada **uma última vez**
 * antes de o exam virar stable definitivo.
 */
export function shouldFetchDetail(
  listingStatus: ExamStatus | null | undefined,
  firestoreStatus: ExamStatus | null | undefined,
): boolean {
  if (firestoreStatus == null) return true
  // Transição só conta quando o listing reporta status definido E diferente.
  // Listing null/undefined é "sem info" — não sobrescreve o que já tem no FS.
  if (listingStatus != null && listingStatus !== firestoreStatus) return true
  if (isStableStatus(firestoreStatus)) return false
  return true
}

/**
 * Heurística de fallback quando listing não expõe status (algumas bancas).
 * Conservadora — erra pra "mutable" (refetch desnecessário) em vez de
 * "stable" (skip indevido que viola janela de freshness de 1 dia).
 *
 * - resultDate < hoje - 30d → closed
 * - examDate < hoje - 90d e sem resultDate → closed
 * - caso contrário → null (sinaliza ao caller que deve refetch)
 */
export function inferStatusFromDates(
  examDate: Date | null | undefined,
  resultDate: Date | null | undefined,
  now: Date = new Date(),
): ExamStatus | null {
  const dayMs = 24 * 60 * 60 * 1000
  if (resultDate && now.getTime() - resultDate.getTime() > 30 * dayMs) {
    return 'closed'
  }
  if (examDate && !resultDate && now.getTime() - examDate.getTime() > 90 * dayMs) {
    return 'closed'
  }
  return null
}
