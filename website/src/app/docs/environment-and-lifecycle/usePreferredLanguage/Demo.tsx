'use client';

import { usePreferredLanguage } from "../../../../../../src";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Layout } from "@/layouts/Layout";

export default function Demo() {
  const { language , setUserLanguage, systemLanguage, userLanguage } = usePreferredLanguage();

  const handleChangeLanguage = (lang: string) => {
    setUserLanguage(lang);
  }
	return (
		<Layout>
      <Layout.Title>Preferred Language</Layout.Title>
      <div className="flex flex-row items-center justify-center gap-2">
        <Tag.Primary>System: {systemLanguage}</Tag.Primary>
        <Tag.Primary>User: {userLanguage}</Tag.Primary>
      </div>
      <Layout.Caption>Resolved Language: <strong>{language}</strong></Layout.Caption>
      <div className="flex flex-row w-full items-center justify-center gap-2">
        <Button.Secondary onClick={() => handleChangeLanguage("en")}>English</Button.Secondary>
        <Button.Secondary onClick={() => handleChangeLanguage("es-PE")}>Spanish</Button.Secondary>
        <Button.Destructive onClick={() => handleChangeLanguage("")}>Clear</Button.Destructive>
      </div>
		</Layout>
	);
}
