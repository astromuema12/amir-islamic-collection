<?php

namespace Tests;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function testBasicAssertion(): void
    {
        $this->assertTrue(true);
    }

    public function testMathOperations(): void
    {
        $this->assertEquals(4, 2 + 2);
        $this->assertGreaterThan(0, 100);
    }
}
