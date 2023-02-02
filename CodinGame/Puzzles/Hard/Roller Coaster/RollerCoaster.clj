(ns Solution
  (:require [clojure.string :as str])
  (:gen-class))

(defn output [msg] (println msg) (flush))
(defn debug [msg] (binding [*out* *err*] (println msg) (flush)))

(defn -main [& args]
  (let [[places rides groupsCount] (map #(Integer/parseInt %) (filter #(not-empty %) (str/split (read-line) #" ")))]

    (def groups [])
    (def earnings 0)
    (def idx 0)
    (def totalPeople 0)

    (dotimes [i groupsCount]
        (let [people (Integer/parseInt (read-line))]
            (def totalPeople (+ totalPeople people))
            (def groups (conj groups people))
        )
    )

    (if (<= totalPeople places)
        (output (* totalPeople rides))
        (do
            (dotimes [r rides]
                (def availablePlaces places)

                (loop []
                    (if (>= availablePlaces (get groups idx))
                        (do
                            (def earnings (+ earnings (get groups idx)))
                            (def availablePlaces (- availablePlaces (get groups idx)))
                            (if (= idx (- groupsCount 1))
                            (def idx 0)
                            (def idx (+ idx 1)))
                            (recur)
                        )
                    )
                )
            )

            (output earnings)
        )
    )
  )
)