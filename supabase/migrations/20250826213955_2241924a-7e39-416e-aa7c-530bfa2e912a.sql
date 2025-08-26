-- Svuota la tabella badge esistente e ricrea con i nuovi badge a tier
DELETE FROM recruiter_badges;
DELETE FROM recruiter_achievements;

-- Badge Outcome Category
INSERT INTO recruiter_badges (name, description, icon, category, requirement_type, requirement_value, points, rarity) VALUES 
-- Closer (Bronze)
('Closer Bronze', 'Raggiungi il 40% di offerte accettate', 'Target', 'outcome', 'acceptance_rate', 40, 100, 'common'),
-- Closer (Silver)
('Closer Silver', 'Raggiungi il 60% di offerte accettate', 'Target', 'outcome', 'acceptance_rate', 60, 200, 'rare'),
-- Closer (Gold)
('Closer Gold', 'Raggiungi il 75% di offerte accettate', 'Target', 'outcome', 'acceptance_rate', 75, 400, 'epic'),

-- Shortlist Pro (Bronze)
('Shortlist Pro Bronze', 'Raggiungi il 25% di shortlist', 'List', 'outcome', 'shortlist_rate', 25, 100, 'common'),
-- Shortlist Pro (Silver)
('Shortlist Pro Silver', 'Raggiungi il 35% di shortlist', 'List', 'outcome', 'shortlist_rate', 35, 200, 'rare'),
-- Shortlist Pro (Gold)
('Shortlist Pro Gold', 'Raggiungi il 45% di shortlist', 'List', 'outcome', 'shortlist_rate', 45, 400, 'epic'),

-- Hires Made (Bronze)
('Hires Made Bronze', '3 assunzioni negli ultimi 12 mesi', 'Users', 'outcome', 'hires_12m', 3, 150, 'common'),
-- Hires Made (Silver)
('Hires Made Silver', '8 assunzioni negli ultimi 12 mesi', 'Users', 'outcome', 'hires_12m', 8, 300, 'rare'),
-- Hires Made (Gold)
('Hires Made Gold', '15 assunzioni negli ultimi 12 mesi', 'Users', 'outcome', 'hires_12m', 15, 600, 'epic'),

-- Retention 90d (Bronze)
('Retention 90d Bronze', '80% degli assunti attivi a 90 giorni', 'Shield', 'outcome', 'retention_90d', 80, 150, 'common'),
-- Retention 90d (Silver)
('Retention 90d Silver', '90% degli assunti attivi a 90 giorni', 'Shield', 'outcome', 'retention_90d', 90, 300, 'rare'),
-- Retention 90d (Gold)
('Retention 90d Gold', '95% degli assunti attivi a 90 giorni', 'Shield', 'outcome', 'retention_90d', 95, 600, 'epic'),

-- Quality Category
-- Client Love (Bronze)
('Client Love Bronze', 'Rating medio ≥4.2', 'Heart', 'quality', 'avg_rating', 42, 100, 'common'),
-- Client Love (Silver)
('Client Love Silver', 'Rating medio ≥4.5', 'Heart', 'quality', 'avg_rating', 45, 250, 'rare'),
-- Client Love (Gold)
('Client Love Gold', 'Rating medio ≥4.8', 'Heart', 'quality', 'avg_rating', 48, 500, 'epic'),

-- Zero Spam (Bronze)
('Zero Spam Bronze', '≤40% rifiuti per mismatch', 'ShieldCheck', 'quality', 'mismatch_rate', 40, 75, 'common'),
-- Zero Spam (Silver)
('Zero Spam Silver', '≤30% rifiuti per mismatch', 'ShieldCheck', 'quality', 'mismatch_rate', 30, 150, 'rare'),
-- Zero Spam (Gold)
('Zero Spam Gold', '≤20% rifiuti per mismatch', 'ShieldCheck', 'quality', 'mismatch_rate', 20, 300, 'epic'),

-- Efficiency Category
-- Speedrunner (Bronze)
('Speedrunner Bronze', 'Time-to-shortlist ≤14 giorni', 'Zap', 'efficiency', 'time_to_shortlist', 14, 100, 'common'),
-- Speedrunner (Silver)
('Speedrunner Silver', 'Time-to-shortlist ≤10 giorni', 'Zap', 'efficiency', 'time_to_shortlist', 10, 250, 'rare'),
-- Speedrunner (Gold)
('Speedrunner Gold', 'Time-to-shortlist ≤7 giorni', 'Zap', 'efficiency', 'time_to_shortlist', 7, 500, 'epic'),

-- Lightning Reply (Bronze)
('Lightning Reply Bronze', 'Risposta ≤24h alle richieste', 'MessageCircle', 'efficiency', 'reply_time', 24, 75, 'common'),
-- Lightning Reply (Silver)
('Lightning Reply Silver', 'Risposta ≤12h alle richieste', 'MessageCircle', 'efficiency', 'reply_time', 12, 150, 'rare'),
-- Lightning Reply (Gold)
('Lightning Reply Gold', 'Risposta ≤4h alle richieste', 'MessageCircle', 'efficiency', 'reply_time', 4, 300, 'epic'),

-- Reliability Category
-- Clean Desk (Bronze)
('Clean Desk Bronze', '0 incidenti compliance in 30 giorni', 'CheckCircle', 'reliability', 'compliance_incidents', 0, 75, 'common'),
-- Clean Desk (Silver)
('Clean Desk Silver', '0 incidenti compliance in 60 giorni', 'CheckCircle', 'reliability', 'compliance_incidents', 0, 150, 'rare'),
-- Clean Desk (Gold)
('Clean Desk Gold', '0 incidenti compliance in 120 giorni', 'CheckCircle', 'reliability', 'compliance_incidents', 0, 300, 'epic'),

-- Consistency Streak (Bronze)
('Consistency Streak Bronze', '4 settimane consecutive con attività', 'Calendar', 'reliability', 'activity_streak', 4, 75, 'common'),
-- Consistency Streak (Silver)
('Consistency Streak Silver', '8 settimane consecutive con attività', 'Calendar', 'reliability', 'activity_streak', 8, 150, 'rare'),
-- Consistency Streak (Gold)
('Consistency Streak Gold', '12 settimane consecutive con attività', 'Calendar', 'reliability', 'activity_streak', 12, 300, 'epic'),

-- Specialty Category
-- Hard Role Hunter (Bronze)
('Hard Role Hunter Bronze', '1 assunzione hard-to-fill in 12 mesi', 'Crosshair', 'specialty', 'hard_roles_12m', 1, 150, 'common'),
-- Hard Role Hunter (Silver)
('Hard Role Hunter Silver', '3 assunzioni hard-to-fill in 12 mesi', 'Crosshair', 'specialty', 'hard_roles_12m', 3, 350, 'rare'),
-- Hard Role Hunter (Gold)
('Hard Role Hunter Gold', '6 assunzioni hard-to-fill in 12 mesi', 'Crosshair', 'specialty', 'hard_roles_12m', 6, 800, 'epic'),

-- Multi-Domain (Bronze)
('Multi-Domain Bronze', 'Assunzioni in 2 domini distinti in 12 mesi', 'Globe', 'specialty', 'domains_12m', 2, 100, 'common'),
-- Multi-Domain (Silver)
('Multi-Domain Silver', 'Assunzioni in 3 domini distinti in 12 mesi', 'Globe', 'specialty', 'domains_12m', 3, 250, 'rare'),
-- Multi-Domain (Gold)
('Multi-Domain Gold', 'Assunzioni in 4 domini distinti in 12 mesi', 'Globe', 'specialty', 'domains_12m', 4, 500, 'epic');