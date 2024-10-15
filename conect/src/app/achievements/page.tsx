"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";

interface Achievements {
  title: string;
  description: string;
  date: string;
  time: string;
  registrationLink: string;
  image: string;
  upcoming: Boolean;
  position: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievements[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/achievements/all`)
      .then((response) => {
        let newAchievements = response.data.map((achievement: Achievements) => {
          const matchResult = achievement.image.match(/file\/d\/(.*?)\//);
          if (matchResult) {
            const fileId = matchResult[1];
            const newImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            return { ...achievement, image: newImageUrl };
          } else {
            return achievement;
          }
        });
        newAchievements.sort(
          (a: Achievements, b: Achievements) => a.position - b.position
        );
        setAchievements(newAchievements);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="text-center text-4xl my-6 font-bold">Accomplishments</h1>
      <div className="grid grid-cols-1 gap-4 p-4">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className="w-full grid grid-cols-1 lg:grid-cols-3 border-2"
          >
            <Image
              src={achievement.image}
              alt={achievement.title}
              height={450}
              width={400}
              className="place-self-center"
              priority={true}
            />
            <div className="col-span-2">
              <CardHeader>
                <CardTitle className="mb-2">{achievement.title}</CardTitle>
                <CardDescription className="text-lg">
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {achievement.time && achievement.date && 
                  (
                  <p className="mb-1">
                    <span className="font-semibold"> Time: </span> {achievement.time}
                  </p>
                  )
                }
                <p className="mb-1">
                  <span className="font-semibold"> Time: </span>{" "}
                  {achievement.time}
                </p>
                {achievement.upcoming ? (
                  <p className="mb-1 text-green-600 font-semibold">Upcoming</p>
                ) : (
                  <p className="mb-1 text-red-600 font-semibold">Conducted</p>
                )}
              </CardContent>
              {achievement.upcoming ? (
                <CardFooter className="flex justify-between">
                  {achievement.registrationLink ? (
                    <Link href={achievement.registrationLink}>
                      <Button>Register</Button>
                    </Link>
                  ) : (
                    <></>
                  )}
                </CardFooter>
              ) : (
                <></>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
