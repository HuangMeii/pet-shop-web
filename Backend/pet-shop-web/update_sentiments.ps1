# Update sentiment_label for all reviews via sentiment server
$sentimentUrl = "http://127.0.0.1:5000/predict"

# Get all reviews with NULL sentiment_label
$reviews = docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -t -A -F "|||" -c "SELECT id, comment FROM reviews WHERE sentiment_label IS NULL AND comment IS NOT NULL AND comment != ''"

$total = 0
$updated = 0

foreach ($line in $reviews) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $parts = $line -split "\|\|\|", 2
    if ($parts.Length -ne 2) { continue }
    
    $reviewId = $parts[0].Trim()
    $comment = $parts[1].Trim()
    $total++
    
    try {
        $body = @{ text = $comment } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $sentimentUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 10
        
        $label = $response.label
        if ($label -match "TÍCH CỰC|positive") {
            $sentiment = "POSITIVE"
        } elseif ($label -match "TIÊU CỰC|negative") {
            $sentiment = "NEGATIVE"
        } else {
            $sentiment = "NEUTRAL"
        }
        
        # Update database
        docker exec -i happy-pet-shop-db psql -U root -d happy_pet_shop -c "UPDATE reviews SET sentiment_label = '$sentiment' WHERE id = '$reviewId'" | Out-Null
        $updated++
        Write-Host "  [$($reviewId.Substring(0,8))] -> $sentiment"
    } catch {
        Write-Host "  [$($reviewId.Substring(0,8))] Error: $_"
    }
}

Write-Host "`nDone! Updated $updated/$total reviews."
