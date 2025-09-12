-- Rimuovi elena.ferri.recruito da recruiter_stats
DELETE FROM recruiter_stats 
WHERE recruiter_email = 'elena.ferri.recruito';

-- Rimuovi anche eventuali achievements
DELETE FROM recruiter_achievements 
WHERE recruiter_email = 'elena.ferri.recruito';

-- Rimuovi eventuali reviews
DELETE FROM recruiter_reviews 
WHERE recruiter_email = 'elena.ferri.recruito';