require "rss"
require "open-uri"
require "json"
require "fileutils"
require "time"

FEED_URL = "https://shanzine.substack.com/feed"
OUTPUT_FILE = "_data/substack.json"
POST_LIMIT = 12

puts "Fetching Substack posts..."

feed_content = URI.open(FEED_URL).read
feed_content.force_encoding("UTF-8")

feed = RSS::Parser.parse(feed_content, false)

posts = feed.items.first(POST_LIMIT).map do |item|
  # Substack includes the post body as HTML.
  html = if item.respond_to?(:content_encoded) && item.content_encoded
           item.content_encoded
         else
           item.description.to_s
         end

  # Find the first image in the post.
  image = html[/<img[^>]+src=["']([^"']+)["']/i, 1]

  # Turn the HTML into plain text for the card preview.
  preview = html
    .gsub(/<script.*?<\/script>/mi, "")
    .gsub(/<style.*?<\/style>/mi, "")
    .gsub(/<[^>]+>/, " ")
    .gsub(/&nbsp;/, " ")
    .gsub(/&amp;/, "&")
    .gsub(/&quot;/, '"')
    .gsub(/&#39;/, "'")
    .gsub(/\s+/, " ")
    .strip

  # Keep previews from getting too long.
  preview = preview[0, 220]
  preview += "..." if preview.length == 220

  {
    "title" => item.title.to_s,
    "url" => item.link.to_s,
    "date" => item.pubDate.strftime("%B %-d, %Y"),
    "image" => image,
    "preview" => preview
  }
end

FileUtils.mkdir_p(File.dirname(OUTPUT_FILE))

File.write(
  OUTPUT_FILE,
  JSON.pretty_generate(posts)
)

puts "Saved #{posts.length} posts to #{OUTPUT_FILE}"