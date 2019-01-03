class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def as_json(opts = {})
    # Exclude internal ID from all external communications
    super opts.merge(except: [:id])
  end
end
