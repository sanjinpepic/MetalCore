-- Add optional nitrogen (N) and niobium (Nb) composition datapoints
ALTER TABLE "Steel" ADD COLUMN IF NOT EXISTS "N" DOUBLE PRECISION,
                 ADD COLUMN IF NOT EXISTS "Nb" DOUBLE PRECISION;
