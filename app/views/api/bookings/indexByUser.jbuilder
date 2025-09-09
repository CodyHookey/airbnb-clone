json.total_pages @bookings.total_pages
json.next_page @bookings.next_page
json.prev_page @bookings.prev_page
json.current_page @bookings.current_page

json.bookings do
  json.array! @bookings do |booking|
    json.id booking.id
    json.start_date booking.start_date
    json.end_date booking.end_date
    json.user_id booking.user_id
    json.property_id booking.property_id
  end
end